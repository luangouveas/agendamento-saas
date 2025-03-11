import { api } from './api-client'

interface BuscarServicoPorIdResponse {
  servico: {
    id: string
    nome: string
    organizacaoId: string
    descricao: string
    tempo: number
    valor: number
  }
}

export async function buscarServicoPorId(slug: string, servicoId: string) {
  const result = await api
    .get(`organizacao/${slug}/servico/${servicoId}`)
    .json<BuscarServicoPorIdResponse>()

  return result
}
