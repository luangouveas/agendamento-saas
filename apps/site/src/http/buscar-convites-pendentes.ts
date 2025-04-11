import { api } from './api-client'

interface BuscarConvitesPendentesRequest {
  slug: string
}

interface BuscarConvitesPendentesResponse {
  convites: {
    id: string
    createdAt: string
    role: string
    email: string
    autor: {
      nome: string
      avatarUrl: string
    }
  }[]
}

export async function BuscarConvitesPendentes({
  slug,
}: BuscarConvitesPendentesRequest) {
  const result = await api
    .get(`organizacao/${slug}/convites-pendentes`, {
      next: {
        tags: [`${slug}/convites-pendentes`],
      },
    })
    .json<BuscarConvitesPendentesResponse>()

  return result
}
