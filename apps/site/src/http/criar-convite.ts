import { api } from './api-client'

interface CriarConviteRequest {
  slug: string
  email: string
  role: string
}

interface CriarConviteResponse {
  conviteId: string
}

export async function CriarConvite({ email, role, slug }: CriarConviteRequest) {
  const result = await api
    .post(`organizacao/${slug}/convite`, {
      json: {
        email,
        role,
      },
    })
    .json<CriarConviteResponse>()

  return result
}
