import { z } from 'zod'

import { roleSchema } from '../roles'

export const usuarioSchema = z.object({
  __typename: z.literal('Usuario').default('Usuario'),
  id: z.string(),
  role: roleSchema,
})

export type Usuario = z.infer<typeof usuarioSchema>
