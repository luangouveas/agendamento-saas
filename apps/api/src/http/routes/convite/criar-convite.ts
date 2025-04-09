import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function CriarConvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizacao/:slug/convite',
      {
        schema: {
          tags: ['Convites'],
          summary:
            'Cria um convite de associação para um usuário novo ou existente.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              conviteId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const usuarioId = await request.getCurrentUserId()
        const { organizacao, membership } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('create', 'Convite')) {
          throw new UnauthorizedError(
            'O usuário não possui permissão para criar convites de associação.',
          )
        }

        const { email, role } = request.body

        const convitePorEmail = await prisma.convite.findUnique({
          where: {
            email_organizacaoId: {
              email,
              organizacaoId: organizacao.id,
            },
          },
        })

        if (convitePorEmail) {
          await prisma.convite.delete({
            where: {
              id: convitePorEmail.id,
            },
          })
        }

        const membroDaOrganizacao = await prisma.membro.findFirst({
          where: {
            organizacaoId: organizacao.id,
            usuario: {
              email,
            },
          },
        })

        if (membroDaOrganizacao) {
          throw new BadRequestError(
            'O usuário com este e-mail já faz parte do estabelecimento',
          )
        }

        const convite = await prisma.convite.create({
          data: {
            email,
            role,
            autorId: usuarioId,
            organizacaoId: organizacao.id,
          },
        })

        return reply.status(201).send({ conviteId: convite.id })
      },
    )
}
