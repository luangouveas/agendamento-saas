import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'

export function BuscarOrganizacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug',
      {
        schema: {
          tags: ['Organizações'],
          summary: 'Busca os dados de uma organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              organizacao: z.object({
                id: z.string().uuid(),
                cnpj: z.string(),
                razaoSocial: z.string(),
                nome: z.string(),
                slug: z.string(),
                rua: z.string(),
                bairro: z.string(),
                cidade: z.string(),
                estado: z.string(),
                cep: z.string(),
                avatarUrl: z.string().url().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
                ownerId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const { organizacao } = await request.getUserMembership(slug)

        return { organizacao }
      },
    )
}
