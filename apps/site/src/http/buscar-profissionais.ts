import { api } from './api-client'

interface BuscarProfissionaisResponse {
  profissionais: {
    id: string
    nome: string
    rua: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
    cep: string | null
    avatarUrl: string | null
    createdAt: Date
    dataNascimento: Date | null
    numeroCelular: string
    email: string | null
  }[]
}

export async function buscarProfissionais(slug: string) {
  const result = await api
    .get(`organizacao/${slug}/profissionais`)
    .json<BuscarProfissionaisResponse>()

  return result
}
