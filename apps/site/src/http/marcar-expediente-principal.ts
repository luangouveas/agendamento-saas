import { api } from './api-client'

interface MarcarExpedientePrincipalRequest {
  slug: string
  membroId: string
  expedienteId: string
}

export async function MarcarExpedientePrincipal({
  expedienteId,
  membroId,
  slug,
}: MarcarExpedientePrincipalRequest) {
  console.log(
    `organizacao/${slug}/membro/${membroId}/expediente/${expedienteId}`,
  )
  await api.patch(
    `organizacao/${slug}/membro/${membroId}/expediente/${expedienteId}`,
  )
}
