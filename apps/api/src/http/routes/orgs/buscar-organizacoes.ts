import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export function BuscarOrganizacoes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacoes',
      {
        schema: {
          tags: ['Organizações'],
          summary: 'Busca a lista de organizações do usuário',
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              organizacoes: z.array(
                z.object({
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
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()

        const organizacoes = await prisma.organizacao.findMany({
          select: {
            id: true,
            nome: true,
            razaoSocial: true,
            cnpj: true,
            cep: true,
            rua: true,
            bairro: true,
            cidade: true,
            estado: true,
            avatarUrl: true,
            slug: true,
          },
          where: {
            membros: {
              some: {
                usuarioId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return { organizacoes }
      },
    )
}
