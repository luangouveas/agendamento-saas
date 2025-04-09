import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function CriarAfiliacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizacao/:slug/membro',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Cria afiliação de um usuário em uma organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            usuarioId: z.string().uuid(),
            tipo: z.union([z.literal('CLIENTE'), z.literal('FUNCIONARIO')]),
            role: roleSchema,
          }),
          response: {
            201: z.object({
              membroId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { role, tipo, usuarioId } = request.body

        const usuarioLogadoId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(
          usuarioLogadoId,
          membership.role,
        )

        if (cannot('create', 'Membro') && cannot('create', 'Convite')) {
          // Permite criar associação caso tenha permissão de envio de convite
          throw new UnauthorizedError(
            'Você não possui permissões para adicionar membros nesta organização.',
          )
        }

        const membroOrganizacaoByUsuarioId = await prisma.membro.findFirst({
          where: {
            usuarioId,
            organizacaoId: organizacao.id,
          },
        })

        if (membroOrganizacaoByUsuarioId) {
          throw new BadRequestError(
            'Este usuário já possui afiliação com esta organização.',
          )
        }

        const membro = await prisma.membro.create({
          data: {
            role,
            tipo,
            usuarioId,
            organizacaoId: organizacao.id,
          },
        })

        return reply.status(201).send({ membroId: membro.id })
      },
    )
}
