import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { criarSlug } from '@/utils/criar-slug'

export function CriarOrganizacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizacao',
      {
        schema: {
          tags: ['Organizações'],
          summary: 'Cria uma organização',
          security: [{ bearerAuth: [] }],
          body: z.object({
            cnpj: z.string().min(14).max(14),
            razaoSocial: z.string(),
            nome: z.string(),
            cep: z.string(),
            rua: z.string(),
            bairro: z.string(),
            cidade: z.string(),
            estado: z.string().min(2).max(2),
          }),
          response: {
            201: z.object({
              organizacaoId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const body = request.body

        const { id: organizacaoId } = await prisma.organizacao.create({
          data: {
            bairro: body.bairro,
            cep: body.cep,
            cidade: body.cidade,
            cnpj: body.cnpj,
            estado: body.estado,
            nome: body.nome,
            razaoSocial: body.razaoSocial,
            rua: body.rua,
            slug: criarSlug(body.nome),
            ownerId: usuarioId,
            membros: {
              create: {
                role: 'ADMIN',
                tipo: 'FUNCIONARIO',
                usuarioId,
              },
            },
          },
        })

        return reply.status(201).send({ organizacaoId })
      },
    )
}
