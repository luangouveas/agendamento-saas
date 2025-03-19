import { api } from './api-client'

interface BuscarAgendamentosResponse {
  agendamentos: {
    id: string
    nomeServico: string
    clienteId: string
    nomeCliente: string
    profissionalId: string
    nomeProfissional: string
    servicoId: string
    tempo: string
    status:
      | 'AGENDADO'
      | 'CONFIRMADO'
      | 'CANCELADO'
      | 'CONCLUIDO'
      | 'PENDENTE'
      | 'NAO_PENDENTE'
    dataHora: string
    valor: number
  }[]
}

export async function BuscarAgendamentos(slug: string, parms: string) {
  const result = await api
    .get(`organizacao/${slug}/agendamentos?${parms}`, {
      next: {
        tags: ['agendamentos-pendentes'],
      },
    })
    .json<BuscarAgendamentosResponse>()

  return result
}
