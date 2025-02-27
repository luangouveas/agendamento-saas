import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AtualizarAfiliacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizacao/:slug/membro',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Atualiza a afiliação de um usuário em uma organização',
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            usuarioId: z.string().uuid(),
            tipo: z.union([z.literal('CLIENTE'), z.literal('FUNCIONARIO')]),
            role: roleSchema,
          }),
          response: {
            204: z.null(),
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

        if (cannot('update', 'Membro')) {
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

        if (!membroOrganizacaoByUsuarioId) {
          throw new BadRequestError(
            'Este usuário não está afiliação nesta organização.',
          )
        }

        await prisma.membro.update({
          data: {
            role,
            tipo,
          },
          where: {
            id: membroOrganizacaoByUsuarioId.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
