import { agendamentoSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function CriarAgendamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizacao/:slug/agendamento',
      {
        schema: {
          tags: ['Agendamento'],
          summary: 'Cadastra um novo agendamento',
          security: [{ bearerAuth: [] }],
          body: z.object({
            clienteId: z.string().uuid(),
            profissionalId: z.string().uuid(),
            servicoId: z.string().uuid(),
            dataHora: z.string().datetime(),
            valor: z.coerce.number(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              agendamentoId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { clienteId, profissionalId, servicoId, dataHora, valor } =
          request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const authAgendamento = agendamentoSchema.parse({
          clienteId,
          profissionalId,
          servicoId,
          dataHora,
          valor,
        })

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('create', authAgendamento)) {
          throw new UnauthorizedError(
            'Você não possui permissão para criar este agendamento.',
          )
        }

        const { id: agendamentoId } = await prisma.agendamento.create({
          data: {
            clienteId,
            profissionalId,
            servicoId,
            dataHora,
            valor,
            organizacaoId: organizacao.id,
          },
        })

        return reply.status(201).send({ agendamentoId })
      },
    )
}
