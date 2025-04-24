import { api } from './api-client'

export type Agendamento = {
  id: string
  nomeServico: string
  clienteId: string
  nomeCliente: string
  avatarCliente: string | null
  profissionalAvatar: string | null
  profissionalId: string
  nomeProfissional: string
  servicoId: string
  servicoAvatar: string | null
  tempo: string
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO'
  dataHora: string
  valor: number
}
interface BuscarAgendamentosResponse {
  agendamentos: Agendamento[]
}

export async function BuscarAgendamentos(slug: string, parms: string) {
  console.log(parms)
  const result = await api
    .get(`organizacao/${slug}/agendamentos?${parms}`, {
      next: {
        tags: ['agendamentos-pendentes'],
      },
    })
    .json<BuscarAgendamentosResponse>()

  return result
}
