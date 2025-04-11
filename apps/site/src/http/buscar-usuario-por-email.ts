import { api } from './api-client'

interface BuscarUsuarioPorEmailRequest {
  slug: string
  email: string
}

interface BuscarUsuarioPorEmailResponse {
  usuario: {
    id: string
    avatarUrl: string
    nome: string
  } | null
}

export async function BuscarUsuarioPorEmail({
  slug,
  email,
}: BuscarUsuarioPorEmailRequest) {
  const result = await api
    .get(`organizacao/${slug}/usuario/${email}`)
    .json<BuscarUsuarioPorEmailResponse>()

  return result
}
