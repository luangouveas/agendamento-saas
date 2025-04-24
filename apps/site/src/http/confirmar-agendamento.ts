import { revalidateTag } from 'next/cache'

import { api } from './api-client'

interface ConfirmarAgendamentoRequest {
  slug: string
  id: string
}

type ConfirmarAgendamentoResponse = Promise<void>

export async function ConfirmarAgendamento(
  data: ConfirmarAgendamentoRequest,
): ConfirmarAgendamentoResponse {
  await api
    .patch(`organizacao/${data.slug}/confirmar-agendamento/${data.id}`)
    .json<ConfirmarAgendamentoResponse>()

  revalidateTag(`${data.slug}/agendamentos-pendentes`)
}
