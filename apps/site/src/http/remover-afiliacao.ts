import { api } from './api-client'

interface RemoverAfiliacaoRequest {
  slug: string
  membroId: string
}

type RemoverAfiliacaoResponse = void

export async function RemoverAfiliacao({
  slug,

  membroId,
}: RemoverAfiliacaoRequest): Promise<RemoverAfiliacaoResponse> {
  await api.delete(`organizacao/${slug}/membro/${membroId}`)
}
