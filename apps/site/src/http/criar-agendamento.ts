import { api } from './api-client'

export interface CriarAgendamentoRequest {
  slug: string
  clienteId: string
  profissionalId: string
  servicoId: string
  dataHora: string
}

interface CriarAgendamentoResponse {
  agendamentoId: string
}

export async function criarAgendamento(
  dadosAgendamento: CriarAgendamentoRequest,
) {
  const result = await api
    .post(`organizacao/${dadosAgendamento.slug}/agendamento`, {
      json: {
        clienteId: dadosAgendamento.clienteId,
        profissionalId: dadosAgendamento.profissionalId,
        servicoId: dadosAgendamento.servicoId,
        dataHora: dadosAgendamento.dataHora,
      },
    })
    .json<CriarAgendamentoResponse>()

  return result
}
