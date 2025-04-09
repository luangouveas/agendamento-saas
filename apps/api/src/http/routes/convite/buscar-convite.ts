import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function BuscarConvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/convite/:id',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Busca os dados de um convite.',
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              convite: z
                .object({
                  id: z.string().uuid(),
                  createdAt: z.date(),
                  role: roleSchema,
                  email: z.string().email(),
                  autor: z
                    .object({
                      nome: z.string(),
                      avatarUrl: z.string().nullable(),
                    })
                    .nullable(),
                  organizacao: z.object({
                    nome: z.string(),
                    avatarUrl: z.string().nullable(),
                  }),
                })
                .nullable(),
            }),
          },
        },
      },
      async (request) => {
        const { id } = request.params

        const convite = await prisma.convite.findUnique({
          where: {
            id,
          },
          select: {
            role: true,
            id: true,
            email: true,
            createdAt: true,
            autor: {
              select: {
                avatarUrl: true,
                nome: true,
              },
            },
            organizacao: {
              select: {
                avatarUrl: true,
                nome: true,
              },
            },
          },
        })

        return { convite }
      },
    )
}
