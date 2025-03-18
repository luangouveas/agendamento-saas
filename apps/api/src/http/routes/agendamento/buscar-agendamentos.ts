import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarAgendamentos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/agendamentos',
      {
        schema: {
          tags: ['Agendamento'],
          summary: 'Busca a lista de agendamentos de uma organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            inicio: z.string().datetime({ precision: 3 }).optional(),
            fim: z.string().datetime({ precision: 3 }).optional(),
            clienteId: z.string().uuid().optional(),
            profissionalId: z.string().uuid().optional(),
            status: z
              .union([
                z.literal('AGENDADO'),
                z.literal('CONFIRMADO'),
                z.literal('CANCELADO'),
                z.literal('CONCLUIDO'),
                z.literal('PENDENTE'),
                z.literal('NAO_PENDENTE'),
              ])
              .optional(),
          }),
          response: {
            200: z.object({
              agendamentos: z.array(
                z.object({
                  id: z.string().uuid(),
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
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { inicio, fim, clienteId, profissionalId, status } = request.query

        if ((!inicio && !fim) || (!clienteId && !profissionalId)) {
          throw new BadRequestError(
            'A consulta deve conter ao menos 1 filtro obrigatório.',
          )
        }

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', 'Agendamento')) {
          throw new UnauthorizedError(
            'Você não possui permissões para buscar agendamentos nesta organização.',
          )
        }

        const listaAgendamentos = await prisma.agendamento.findMany({
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
            id: true,
            dataHora: true,
            status: true,
            valor: true,
          },
          where: {
            clienteId: clienteId ?? undefined,
            profissionalId: profissionalId ?? undefined,

            status: status
              ? status === 'PENDENTE'
                ? { in: ['AGENDADO', 'CONFIRMADO'] }
                : status === 'NAO_PENDENTE'
                  ? { in: ['CANCELADO', 'CONCLUIDO'] }
                  : status
              : undefined,

            organizacaoId: organizacao.id,
            dataHora: {
              gte: inicio,
              lte: fim,
            },
          },
          orderBy: {
            dataHora: 'asc',
          },
        })

        const agendamentos = listaAgendamentos.map(
          ({
            cliente: { id: clienteId, nome: nomeCliente },
            profissional: { id: profissionalId, nome: nomeProfissional },
            servico: { id: servicoId, nome: nomeServico, ...servico },
            ...agendamento
          }) => {
            return {
              ...agendamento,
              ...servico,
              nomeServico,
              clienteId,
              nomeCliente,
              profissionalId,
              nomeProfissional,
              servicoId,
            }
          },
        )

        return { agendamentos }
      },
    )
}
