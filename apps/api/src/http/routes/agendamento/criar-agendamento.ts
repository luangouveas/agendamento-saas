import { agendamentoSchema } from '@agendamento-saas/auth'
import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
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
            membroId: z.string().uuid(),
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
        const { clienteId, membroId, servicoId, dataHora, valor } = request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const [servico, membroProfissional] = await Promise.all([
          prisma.servico.findUnique({ where: { id: servicoId } }),
          prisma.membro.findUnique({
            where: { id: membroId },
            include: {
              usuario: true,
              expedientes: {
                where: { expedientePrincipal: true },
                include: { diasExpediente: true },
              },
            },
          }),
        ])

        if (
          !servico ||
          !membroProfissional ||
          !membroProfissional.expedientes
        ) {
          throw new BadRequestError(
            'Desculpe, houve algum problema para confirmar a disponibilidade do profissional.',
          )
        }

        const profissionalId = membroProfissional.usuarioId

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

        const data = new Date(dataHora)

        const expediente = membroProfissional.expedientes[0]

        if (!expediente) {
          throw new BadRequestError('Profissional sem expediente neste dia.')
        }

        const expedienteDia = expediente.diasExpediente.find(
          (x) => x.diaSemana === data.getDay(),
        )

        if (!expedienteDia) {
          throw new BadRequestError('Profissional sem expediente neste dia.')
        }

        const inicioExpediente = `${format(data, 'yyyy-MM-dd')}T${expedienteDia?.inicio}:00Z`
        const terminoExpediente = `${format(data, 'yyyy-MM-dd')}T${expedienteDia?.fim}:00Z`

        const inicioDoAgendamentoCandidato = data
        const terminoDoAgendamentoCandidato = addMinutes(
          inicioDoAgendamentoCandidato,
          servico.tempo,
        )

        // Valida se horario é válido dentro do expediente do profissional
        if (
          isBefore(inicioDoAgendamentoCandidato, inicioExpediente) ||
          isAfter(inicioDoAgendamentoCandidato, terminoExpediente) ||
          isAfter(terminoDoAgendamentoCandidato, terminoExpediente)
        ) {
          throw new BadRequestError(
            'O horario conflita com o expediente do profissional.',
          )
        }

        // Valida se o horario é valido considenrando o intervalo do profissional
        const hasIntervalo =
          expedienteDia.inicioIntervalo && expedienteDia.fimIntervalo

        if (hasIntervalo) {
          const intervaloInicio = parseISO(
            `${format(data, 'yyyy-MM-dd')}T${expedienteDia.inicioIntervalo}:00Z`,
          )
          const intervaloFim = parseISO(
            `${format(data, 'yyyy-MM-dd')}T${expedienteDia.fimIntervalo}:00Z`,
          )

          if (
            (isAfter(inicioDoAgendamentoCandidato, intervaloInicio) ||
              isEqual(inicioDoAgendamentoCandidato, intervaloInicio)) &&
            isBefore(inicioDoAgendamentoCandidato, intervaloFim)
          ) {
            throw new BadRequestError(
              'O horario escolhido conflita com o intervalo do profissional',
            )
          }
          if (
            (isBefore(inicioDoAgendamentoCandidato, intervaloInicio) ||
              isEqual(inicioDoAgendamentoCandidato, intervaloInicio)) &&
            isAfter(terminoDoAgendamentoCandidato, intervaloInicio)
          ) {
            throw new BadRequestError(
              'O horario escolhido conflita com o intervalo do profissional',
            )
          }
        }

        const agendamentosDoDia = await prisma.agendamento.findMany({
          where: {
            profissionalId,
            dataHora: {
              gte: inicioExpediente,
              lt: terminoExpediente,
            },
            status: {
              notIn: ['CANCELADO'],
            },
          },
          include: { servico: true },
        })

        // Valida se o horario é valido considerando outros agendamentos para esse profissional
        if (agendamentosDoDia) {
          agendamentosDoDia?.forEach((ag) => {
            const agStart = new Date(ag.dataHora)
            const agEnd = addMinutes(agStart, ag.servico.tempo)
            if (
              inicioDoAgendamentoCandidato < agEnd &&
              terminoDoAgendamentoCandidato > agStart
            ) {
              throw new BadRequestError(
                'Existe um agendamento causando conflito de horário para este profissional.',
              )
            }
          })
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
