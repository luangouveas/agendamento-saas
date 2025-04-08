import { organizacaoSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function ExcluirOrganizacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizacao/:slug',
      {
        schema: {
          tags: ['Organizações'],
          summary: 'Excluir a organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const authOrganizacao = organizacaoSchema.parse(organizacao)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('delete', authOrganizacao)) {
          throw new UnauthorizedError(
            'Você não possui permissão para excluir este estabelecimento.',
          )
        }

        await prisma.organizacao.delete({
          where: {
            id: organizacao.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
