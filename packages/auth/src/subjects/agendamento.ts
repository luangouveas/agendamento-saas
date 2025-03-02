import { z } from 'zod'

import { agendamentoSchema } from '../models/agendamento'

export const agendamentoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('concluir_agendamento'),
    z.literal('confirmar_agendamento'),
    z.literal('cancelar_agendamento'),
    z.literal('reabrir_agendamento'),
    z.literal('transferir_agendamento'),
    z.literal('reagendar_agendamento'),
  ]),
  z.union([z.literal('Agendamento'), agendamentoSchema]),
])

export type AgendamentoSubject = z.infer<typeof agendamentoSubject>
