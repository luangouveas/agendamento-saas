import { z } from 'zod'

import { organizacaoSchema } from '../models/organizacao'

export const organizacaoSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('create'), z.literal('update')]),
  z.union([z.literal('Organizacao'), organizacaoSchema]),
])

export type OrganizacaoSubject = z.infer<typeof organizacaoSubject>
