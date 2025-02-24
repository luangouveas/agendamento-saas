import { z } from 'zod'

export const organizacaoSchema = z.object({
  __typename: z.literal('Organizacao').default('Organizacao'),
  id: z.string(),
  ownerId: z.string(),
})

export type Organizacao = z.infer<typeof organizacaoSchema>
