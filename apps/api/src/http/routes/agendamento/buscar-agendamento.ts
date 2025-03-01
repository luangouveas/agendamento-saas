import { agendamentoSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarAgendamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/agendamento/:agendamentoId',
      {
        schema: {
          tags: ['Agendamento'],
          summary: 'Busca os dados de um agendamento',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            agendamentoId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              agendamento: z.object({
                nomeServico: z.string(),
                clienteId: z.string().uuid(),
                nomeCliente: z.string(),
                profissionalId: z.string().uuid(),
                nomeProfissional: z.string(),
                servicoId: z.string().uuid(),
                tempo: z.number(),
                status: z.union([
                  z.literal('AGENDADO'),
                  z.literal('CONFIRMADO'),
                  z.literal('CANCELADO'),
                  z.literal('CONCLUIDO'),
                ]),
                dataHora: z.date(),
                valor: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, agendamentoId } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const agendamentoById = await prisma.agendamento.findFirst({
          select: {
            cliente: {
              select: {
                id: true,
                nome: true,
              },
            },
            profissional: {
              select: {
                id: true,
                nome: true,
              },
            },
            servico: {
              select: {
                id: true,
                nome: true,
                tempo: true,
              },
            },
            dataHora: true,
            status: true,
            valor: true,
          },
          where: {
            id: agendamentoId,
            organizacaoId: organizacao.id,
          },
        })

        if (!agendamentoById) {
          throw new BadRequestError('Agendamento não encontrado.')
        }

        const agendamento = {
          servicoId: agendamentoById.servico.id,
          nomeServico: agendamentoById.servico.nome,
          clienteId: agendamentoById.cliente.id,
          nomeCliente: agendamentoById.cliente.nome,
          profissionalId: agendamentoById.profissional.id,
          nomeProfissional: agendamentoById.profissional.nome,
          tempo: agendamentoById.servico.tempo,
          status: agendamentoById.status,
          dataHora: agendamentoById.dataHora,
          valor: agendamentoById.valor,
        }

        const authAgendamento = agendamentoSchema.parse(agendamento)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', authAgendamento)) {
          throw new UnauthorizedError(
            'Você não possui permissões para buscar agendamentos nesta organização.',
          )
        }

        return { agendamento }
      },
    )
}
