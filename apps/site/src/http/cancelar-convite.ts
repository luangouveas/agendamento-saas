import { api } from './api-client'

interface CancelarConviteRequest {
  slug: string
  conviteId: string
}

type CancelarConviteResponse = void

export async function CancelarConvite({
  slug,
  conviteId,
}: CancelarConviteRequest): Promise<CancelarConviteResponse> {
  await api.delete(`organizacao/${slug}/convite/${conviteId}/cancelar`)
}
