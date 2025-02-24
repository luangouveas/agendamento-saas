import { z } from 'zod'

export const servicoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Servico'),
])

export type ServicoSubject = z.infer<typeof servicoSubject>
