import { api } from './api-client'

interface BuscarExpedientesMembroRequest {
  slug: string
  membroId: string
}

interface BuscarExpedientesMembroResponse {
  expedientes: {
    id: string
    nome: string
    expedientePrincipal: boolean
  }[]
}

export async function BuscarExpedientesMembro({
  slug,
  membroId,
}: BuscarExpedientesMembroRequest) {
  const result = await api
    .get(`organizacao/${slug}/expedientes/${membroId}`, {
      next: {
        tags: [`${membroId}/expedientes`],
      },
    })
    .json<BuscarExpedientesMembroResponse>()

  return result
}
