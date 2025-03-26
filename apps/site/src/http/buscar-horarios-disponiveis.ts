import { api } from './api-client'

export type DiasDisponiveisProfissional = {
  diaSemana: string
  data: string
  horarios: string[]
}[]
interface BuscarHorariosDisponiveisResponse {
  diasDisponiveis: DiasDisponiveisProfissional
}

export async function buscarHorariosDisponiveis(
  slug: string,
  servicoId: string,
  membroId: string,
  diaSugerido?: string,
) {
  const filtroDia = diaSugerido ? `?diaSugerido=${diaSugerido}` : ''
  const url = `organizacao/${slug}/profissional/${membroId}/horarios-disponiveis/servico/${servicoId}${filtroDia}`

  const result = await api.get(url).json<BuscarHorariosDisponiveisResponse>()

  return result
}
