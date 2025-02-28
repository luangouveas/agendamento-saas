import { agendamentoSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AtualizarAgendamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizacao/:slug/agendamento/:id',
      {
        schema: {
          tags: ['Agendamento'],
          summary: 'Atualiza um agendamento',
          security: [{ bearerAuth: [] }],
          body: z.object({
            clienteId: z.string().uuid(),
            profissionalId: z.string().uuid(),
            servicoId: z.string().uuid(),
            dataHora: z.date(),
            valor: z.coerce.number(),
          }),
          params: z.object({
            slug: z.string(),
            id: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
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

        if (cannot('update', authAgendamento)) {
          throw new UnauthorizedError(
            'Você não possui permissão para atualizar este agendamento.',
          )
        }

        await prisma.agendamento.update({
          where: {
            id,
          },
          data: {
            clienteId,
            profissionalId,
            servicoId,
            dataHora,
            valor,
            organizacaoId: organizacao.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
