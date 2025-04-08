import { api } from './api-client'

interface AtualizarServicoRequest {
  nome: string
  descricao: string
  tempo: number
  valor: number
}

type AtualizarServicoResponse = void

export async function AtualizarServico(
  servico: AtualizarServicoRequest,
  slug: string,
  id: string,
): Promise<AtualizarServicoResponse> {
  await api.put(`organizacao/${slug}/servico/${id}`, {
    json: {
      nome: servico.nome,
      descricao: servico.descricao,
      valor: servico.valor,
      tempo: servico.tempo,
    },
  })
}
