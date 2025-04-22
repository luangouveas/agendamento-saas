import { api } from './api-client'

interface CriarExpedienteRequest {
  slug: string
  membroId: string
  nome: string
  diasExpediente: {
    diaSemana: number
    inicio: string
    fim: string
    inicioIntervalo?: string | null
    fimIntervalo?: string | null
  }[]
}

interface CriarExpedienteResponse {
  expedienteId: string
}

export async function CriarExpediente(data: CriarExpedienteRequest) {
  const result = await api
    .post(`organizacao/${data.slug}/expediente`, {
      json: {
        nome: data.nome,
        membroId: data.membroId,
        diasExpediente: data.diasExpediente,
      },
    })
    .json<CriarExpedienteResponse>()

  return result
}
