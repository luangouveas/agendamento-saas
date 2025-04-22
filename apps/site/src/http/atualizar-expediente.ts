import { api } from './api-client'

interface AtualizarExpedienteRequest {
  expedienteId: string
  slug: string
  nome: string
  diasExpediente: {
    diaSemana: number
    inicio: string
    fim: string
    inicioIntervalo?: string | null
    fimIntervalo?: string | null
  }[]
}

export async function AtualizarExpediente(data: AtualizarExpedienteRequest) {
  await api.put(`organizacao/${data.slug}/expediente/${data.expedienteId}`, {
    json: {
      nome: data.nome,
      diasExpediente: data.diasExpediente,
    },
  })
}
