import { api } from './api-client'

interface AtualizarAfiliacaoRequest {
  slug: string
  membroId: string
  tipo: string
  role: string
}

type AtualizarAfiliacaoResponse = void

export async function AtualizarAfiliacao({
  role,
  slug,
  tipo,
  membroId,
}: AtualizarAfiliacaoRequest): Promise<AtualizarAfiliacaoResponse> {
  await api.put(`organizacao/${slug}/membro/${membroId}`, {
    json: {
      tipo,
      role,
    },
  })
}
