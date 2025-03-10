import { api } from './api-client'

interface BuscarHorariosDisponiveisResponse {
  diasDisponiveis: {
    diaSemana: string
    data: string
    horarios: string[]
  }[]
}

export async function buscarHorariosDisponiveis(
  slug: string,
  servicoId: string,
  membroId: string,
) {
  const result = await api
    .get(
      `organizacao/${slug}/profissional/${membroId}/horarios-disponiveis/servico/${servicoId}`,
    )
    .json<BuscarHorariosDisponiveisResponse>()

  return result
}
