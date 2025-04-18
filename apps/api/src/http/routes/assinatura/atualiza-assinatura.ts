import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export function AtualizarAssinatura(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/assinatura',
      {
        schema: {
          tags: ['Assinatura'],
          summary: 'Atualiza assinatura do cliente',
          security: [{ bearerAuth: [] }],
          body: z.object({
            stripeCustomerId: z.string().nullable(),
            stripeSubscriptionId: z.string().nullable(),
            stripeSubscriptionStatus: z.string().nullable(),
            stripePriceId: z.string().nullable(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const {
          stripeCustomerId,
          stripePriceId,
          stripeSubscriptionId,
          stripeSubscriptionStatus,
        } = request.body

        const usuarioId = await request.getCurrentUserId()

        await prisma.usuario.update({
          where: {
            id: usuarioId,
          },
          data: {
            stripeCustomerId,
            stripePriceId,
            stripeSubscriptionId,
            stripeSubscriptionStatus,
          },
        })

        return reply.status(204).send()
      },
    )
}
