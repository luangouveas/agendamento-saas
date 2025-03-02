import { z } from 'zod'

import { expedienteSchema } from '../models/expediente'

export const expedienteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('marcar_principal'),
  ]),
  z.union([z.literal('Expediente'), expedienteSchema]),
])

export type ExpedienteSubject = z.infer<typeof expedienteSubject>
