import { z } from 'zod'

export const expedienteSchema = z.object({
  __typename: z.literal('Expediente').default('Expediente'),
  membroId: z.string().uuid(),
  usuarioId: z.string().uuid(),
})

export type Expediente = z.infer<typeof expedienteSchema>
