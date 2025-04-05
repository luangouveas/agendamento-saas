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
          summary: 'Busca os dados do assinante',
          security: [{ bearerAuth: [] }],
          body: z.object({
            stripeCustomerId: z.string(),
            stripeSubscriptionId: z.string(),
            stripeSubscriptionStatus: z.string(),
            stripePriceId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const {
          stripeCustomerId,
          stripePriceId,
          stripeSubscriptionId,
          stripeSubscriptionStatus,
        } = request.body

        const usuario = await prisma.usuario.findUnique({
          where: {
            id: usuarioId,
          },
        })

        if (!usuario) {
          throw new BadRequestError('Usuário assinante não encontrado')
        }

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
