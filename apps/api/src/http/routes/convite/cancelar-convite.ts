import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function CancelarConvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizacao/:slug/convite/:id/cancelar',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Cancela um convite ainda pendnete.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            id: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('delete', 'Convite')) {
          throw new UnauthorizedError(
            'O usuário não possui permissão para cancelar convites de associação.',
          )
        }

        const convite = await prisma.convite.findUnique({
          where: {
            id,
          },
        })

        if (!convite) {
          throw new BadRequestError('Erro ao tentar cancelar o convite.')
        }

        await prisma.convite.delete({
          where: {
            id,
          },
        })

        reply.status(204).send()
      },
    )
}
