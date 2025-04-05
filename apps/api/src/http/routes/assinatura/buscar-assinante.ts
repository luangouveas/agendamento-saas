import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export function BuscarAssinante(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/assinatura/assinante/:stripeCustomerId',
      {
        schema: {
          tags: ['Assinatura'],
          summary: 'Busca os dados do assinante',
          security: [{ bearerAuth: [] }],
          params: z.object({
            stripeCustomerId: z.string(),
          }),
          response: {
            200: z.object({
              assinante: z.object({
                id: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()

        const { stripeCustomerId } = request.params

        const assinante = await prisma.usuario.findFirst({
          where: {
            stripeCustomerId,
          },
          select: {
            id: true,
          },
        })

        if (!assinante) {
          throw new BadRequestError('Usuário assinante não encontrado')
        }

        return { assinante }
      },
    )
}
