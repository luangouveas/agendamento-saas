import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarHorariosDisponiveis(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/profissional/:membroId/horarios-disponiveis/servico/:servicoId',
      {
        schema: {
          tags: ['Expediente'],
          summary:
            'Busca dias e horários disponíveis na agenda de um profissional.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            membroId: z.string().uuid(),
            servicoId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              diasDisponiveis: z.array(
                z.object({
                  diaSemana: z.string(),
                  data: z.string(),
                  horarios: z.array(z.string()),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug, membroId, servicoId } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', 'Expediente') && membership.role !== 'CLIENTE') {
          throw new UnauthorizedError(
            'Você não possui permissão para visualizar os horários disponíveis deste profissional.',
          )
        }

        const [servico, membro] = await Promise.all([
          prisma.servico.findUnique({ where: { id: servicoId } }),
          prisma.membro.findUnique({
            where: { id: membroId },
            include: {
              usuario: true,
              expedientes: { include: { diasExpediente: true } },
            },
          }),
        ])

        if (!servico || !membro || !membro.expedientes.length) {
          throw new BadRequestError('Sem horários para exibir.')
        }

        const tempoServico = servico.tempo
        const intervaloAgenda = organizacao.intervaloAgenda
        const expediente = membro.expedientes.find(
          (exp) => exp.expedientePrincipal,
        )
        const diasExpediente = expediente?.diasExpediente || []

        const diasDisponiveis = []
        const dataAtual = new Date()

        // Gerar para os próximos 5 dias que possuírem expediente
        for (let i = 0; diasDisponiveis.length < 5; i++) {
          const data = addMinutes(startOfDay(dataAtual), i * 1440)
          const diaSemana = data.getDay()

          const expedienteDia = diasExpediente.find(
            (d) => d.diaSemana === diaSemana,
          )
          if (!expedienteDia) continue

          const horariosDisponiveis = []
          let candidate = parseISO(
            `${format(data, 'yyyy-MM-dd')}T${expedienteDia.inicio}:00Z`,
          )
          const workingEnd = parseISO(
            `${format(data, 'yyyy-MM-dd')}T${expedienteDia.fim}:00Z`,
          )

          // Buscar agendamentos do profissional nesse dia
          const agendamentos = await prisma.agendamento.findMany({
            where: {
              profissionalId: membro.usuarioId,
              dataHora: {
                gte: parseISO(`${format(data, 'yyyy-MM-dd')}T00:00:00Z`),
                lt: parseISO(`${format(data, 'yyyy-MM-dd')}T23:59:59Z`),
              },
            },
            orderBy: { dataHora: 'asc' },
            include: { servico: true },
          })

          while (isBefore(candidate, workingEnd)) {
            const candidateEnd = addMinutes(candidate, tempoServico)

            if (isAfter(candidateEnd, workingEnd)) {
              break
            }

            const hasIntervalo =
              expedienteDia.inicioIntervalo && expedienteDia.fimIntervalo

            // Verifica conflito com periodo de intervalo
            if (hasIntervalo) {
              const breakStart = parseISO(
                `${format(data, 'yyyy-MM-dd')}T${expedienteDia.inicioIntervalo}:00Z`,
              )
              const breakEnd = parseISO(
                `${format(data, 'yyyy-MM-dd')}T${expedienteDia.fimIntervalo}:00Z`,
              )

              if (
                (isAfter(candidate, breakStart) ||
                  isEqual(candidate, breakStart)) &&
                isBefore(candidate, breakEnd)
              ) {
                candidate = breakEnd
                continue
              }
              if (
                (isBefore(candidate, breakStart) ||
                  isEqual(candidate, breakStart)) &&
                isAfter(candidateEnd, breakStart)
              ) {
                candidate = breakEnd
                continue
              }
            }

            // Verifica conflitos com agendamentos já existentes
            let conflict = false
            for (const ag of agendamentos) {
              const agStart = new Date(ag.dataHora)
              const agEnd = addMinutes(agStart, ag.servico.tempo)
              if (candidate < agEnd && candidateEnd > agStart) {
                conflict = true
                candidate = agEnd
                break
              }
            }

            if (conflict) continue

            horariosDisponiveis.push(
              format(addMinutes(candidate, 180), 'HH:mm'),
            )

            candidate = addMinutes(candidate, intervaloAgenda)
          }

          diasDisponiveis.push({
            diaSemana: format(data, 'EEEE', { locale: ptBR }),
            data: format(data, 'dd/MM/yyyy'),
            horarios: horariosDisponiveis,
          })
        }

        return { diasDisponiveis }
      },
    )
}
