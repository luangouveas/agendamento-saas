import { api } from './api-client'

interface ExcluirExpedienteRequest {
  expedienteId: string
  slug: string
}

export async function ExcluirExpediente({
  slug,
  expedienteId,
}: ExcluirExpedienteRequest) {
  await api.delete(`organizacao/${slug}/expediente/${expedienteId}`)
}
