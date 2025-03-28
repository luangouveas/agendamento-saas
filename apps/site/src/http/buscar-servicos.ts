import { api } from './api-client'

interface BuscarServicosResponse {
  servicos: {
    id: string
    nome: string
    organizacaoId: string
    descricao: string
    valor: number
    tempo: number
    avatarUrl?: string | null
  }[]
}

export async function buscarServicos(slug: string) {
  const result = await api
    .get(`organizacao/${slug}/servicos`)
    .json<BuscarServicosResponse>()

  return result
}
