import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

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
            email: z.string().email(),
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
          email,
          stripeCustomerId,
          stripePriceId,
          stripeSubscriptionId,
          stripeSubscriptionStatus,
        } = request.body

        const usuario = await prisma.usuario.findUnique({
          where: {
            email,
          },
        })

        if (!usuario) {
          throw new BadRequestError('Usuário assinante não encontrado')
        }

        await prisma.usuario.update({
          where: {
            id: usuario.id,
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
