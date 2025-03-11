import { api } from './api-client'

interface BuscarProfissionalPorIdResponse {
  profissional: {
    id: string
    nome: string
    rua: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
    cep: string | null
    avatarUrl: string | null
    createdAt: Date
    membroId: string
    dataNascimento: Date | null
    numeroCelular: string
    email: string | null
  }
}

export async function buscarProfissionalPorId(
  slug: string,
  profissionalId: string,
) {
  const result = await api
    .get(`organizacao/${slug}/profissional/${profissionalId}`)
    .json<BuscarProfissionalPorIdResponse>()

  return result
}
