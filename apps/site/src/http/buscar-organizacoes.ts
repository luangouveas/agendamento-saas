import { api } from './api-client'

interface BuscarOrganizacoesResponse {
  organizacoes: {
    id: string
    cnpj: string
    razaoSocial: string
    nome: string
    slug: string
    rua: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    avatarUrl: string | null
  }[]
}

export async function buscarOrganizacoes() {
  const result = await api
    .get('organizacoes')
    .json<BuscarOrganizacoesResponse>()

  return result
}
