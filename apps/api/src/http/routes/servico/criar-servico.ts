import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function CriarServico(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizacao/:slug/servico',
      {
        schema: {
          tags: ['Serviço'],
          summary: 'Cadastra um novo serviço',
          security: [{ bearerAuth: [] }],
          body: z.object({
            nome: z.string(),
            descricao: z.string(),
            tempo: z.number(),
            valor: z.coerce.number(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              servicoId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { nome, descricao, tempo, valor } = request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('create', 'Servico')) {
          throw new UnauthorizedError(
            'Você não possui permissões para criar serviços nesta organização.',
          )
        }

        const { id: servicoId } = await prisma.servico.create({
          data: {
            nome,
            descricao,
            tempo,
            valor,
            organizacaoId: organizacao.id,
          },
        })

        return reply.status(201).send({ servicoId })
      },
    )
}
