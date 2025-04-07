import { api } from './api-client'

interface BuscarOrganizacaoResponse {
  organizacao: {
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
    intervaloAgenda: number
    createdAt: Date
    updatedAt: Date
    ownerId: string
  }
}

export async function BuscarOrganizacao(slug: string) {
  const result = await api
    .get(`organizacao/${slug}`, {
      next: {
        tags: ['organizacao'],
      },
    })
    .json<BuscarOrganizacaoResponse>()

  return result
}
