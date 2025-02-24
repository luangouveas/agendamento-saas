import { z } from 'zod'

export const agendamentoSchema = z.object({
  __typename: z.literal('Agendamento').default('Agendamento'),
  id: z.string(),
  servicoId: z.string(),
  profissionalId: z.string(),
  clienteId: z.string(),
})

export type Agendamento = z.infer<typeof agendamentoSchema>
