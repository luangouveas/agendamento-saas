import { revalidateTag } from 'next/cache'

import { api } from './api-client'

interface CancelarAgendamentoRequest {
  slug: string
  id: string
}

type CancelarAgendamentoResponse = Promise<void>

export async function CancelarAgendamento(
  data: CancelarAgendamentoRequest,
): CancelarAgendamentoResponse {
  await api
    .patch(`organizacao/${data.slug}/cancelar-agendamento/${data.id}`)
    .json<CancelarAgendamentoResponse>()

  revalidateTag(`${data.slug}/agendamentos-pendentes`)
}
