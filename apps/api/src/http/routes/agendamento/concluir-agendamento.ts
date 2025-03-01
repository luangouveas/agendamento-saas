import { agendamentoSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function ConcluirAgendamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizacao/:slug/concluir-agendamento/:id',
      {
        schema: {
          tags: ['Agendamento'],
          summary: 'Conclui um agendamento',
          security: [{ bearerAuth: [] }],
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

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const agendamento = await prisma.agendamento.findUnique({
          where: {
            id,
          },
        })

        if (!agendamento) {
          throw new BadRequestError('Agendamento não encontrado.')
        }

        const authAgendamento = agendamentoSchema.parse(agendamento)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (agendamento.status === 'CONCLUIDO') {
          throw new BadRequestError('Não é possível concluir este agendamento.')
        }

        if (cannot('concluir_agendamento', authAgendamento)) {
          throw new UnauthorizedError(
            'Você não possui permissão para concluir este agendamento.',
          )
        }

        await prisma.agendamento.update({
          where: {
            id,
          },
          data: {
            status: 'CONCLUIDO',
          },
        })

        return reply.status(204).send()
      },
    )
}
