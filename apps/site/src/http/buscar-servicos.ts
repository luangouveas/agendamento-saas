import { api } from './api-client'

interface BuscarServicosResponse {
  servicos: {
    id: number
    nome: string
    organizacaoId: string
    descricao: string
    valor: number
    tempo: number
  }[]
}

export async function buscarServicos(slug: string) {
  const result = await api
    .get(`organizacao/${slug}/servicos`)
    .json<BuscarServicosResponse>()

  return result
}
