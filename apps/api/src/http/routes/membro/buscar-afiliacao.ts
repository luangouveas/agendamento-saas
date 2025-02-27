import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'

export function BuscarAfiliacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/afiliacao',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Busca dados de afiliação entre o usuario e uma organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              afiliacao: z.object({
                id: z.string().uuid(),
                role: roleSchema,
                tipo: z.union([z.literal('CLIENTE'), z.literal('FUNCIONARIO')]),
                organizacaoId: z.string().uuid(),
                usuarioId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        return {
          afiliacao: membership,
        }
      },
    )
}
