import { z } from 'zod'

export const membroSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
  ]),
  z.literal('Membro'),
])

export type MembroSubject = z.infer<typeof membroSubject>
