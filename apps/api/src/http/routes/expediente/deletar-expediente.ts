import { expedienteSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function DeletarExpediente(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizacao/:slug/expediente/:expedienteId',
      {
        schema: {
          tags: ['Expediente'],
          summary: 'Exclui o expediente de um profissional.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            expedienteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, expedienteId } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        const authExpediente = expedienteSchema.parse({
          usuarioId,
          membroId: membership.id,
        })

        if (cannot('delete', authExpediente)) {
          throw new UnauthorizedError(
            'Você não tem permissão para excluir este expediente.',
          )
        }

        await prisma.$transaction([
          prisma.diasExpediente.deleteMany({
            where: {
              expedienteId,
            },
          }),

          prisma.expediente.delete({
            where: {
              id: expedienteId,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
