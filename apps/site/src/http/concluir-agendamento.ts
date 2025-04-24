import { revalidateTag } from 'next/cache'

import { api } from './api-client'

interface ConcluirAgendamentoRequest {
  slug: string
  id: string
}

type ConcluirAgendamentoResponse = Promise<void>

export async function ConcluirAgendamento({
  id,
  slug,
}: ConcluirAgendamentoRequest): ConcluirAgendamentoResponse {
  await api
    .patch(`organizacao/${slug}/concluir-agendamento/${id}`)
    .json<ConcluirAgendamentoResponse>()

  revalidateTag(`${slug}/agendamentos-pendentes`)
}
