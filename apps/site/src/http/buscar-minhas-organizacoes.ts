import { Organizacao } from '@/interfaces/organizacao'

import { api } from './api-client'

interface BuscarOrganizacoesResponse {
  organizacoes: Organizacao[]
}

export async function buscarMinhasOrganizacoes() {
  const result = await api
    .get('minhas-organizacoes')
    .json<BuscarOrganizacoesResponse>()

  return result
}
