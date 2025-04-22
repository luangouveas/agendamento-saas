import { api } from './api-client'

interface BuscarExpedientesRequest {
  slug: string
  expedienteId: string
}

interface BuscarExpedienteResponse {
  expediente: {
    id: string
    nome: string
    expedientePrincipal: boolean
    diasExpediente: {
      id: string
      diaSemana: number
      inicio: string
      fim: string
      inicioIntervalo: string | null
      fimIntervalo: string | null
    }[]
  }
}

export async function BuscarExpediente({
  slug,
  expedienteId,
}: BuscarExpedientesRequest) {
  const result = await api
    .get(`organizacao/${slug}/expediente/${expedienteId}`)
    .json<BuscarExpedienteResponse>()

  return result
}
