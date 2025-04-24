export interface BuscarAgendamentosFiltros {
  clienteId?: string
  profissionalId?: string
  inicio?: string
  fim?: string
  status?:
    | 'AGENDADO'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'CONCLUIDO'
    | 'PENDENTE'
    | 'NAO_PENDENTE'
}

export function createQueryStringAgendamentos(
  filtros: BuscarAgendamentosFiltros,
): string {
  const queryParams = new URLSearchParams()
  if (filtros.clienteId) queryParams.append('clienteId', filtros.clienteId)
  if (filtros.profissionalId)
    queryParams.append('profissionalId', filtros.profissionalId)
  if (filtros.inicio) queryParams.append('inicio', filtros.inicio)
  if (filtros.fim) queryParams.append('fim', filtros.fim)
  if (filtros.status) queryParams.append('status', filtros.status)
  return queryParams.toString()
}
