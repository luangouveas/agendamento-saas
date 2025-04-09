import { Organizacao } from '@/interfaces/organizacao'

import { api } from './api-client'

interface BuscarOrganizacoesResponse {
  organizacoes: Organizacao[]
}

export async function buscarOrganizacoes() {
  const result = await api
    .get('organizacoes', {
      next: {
        tags: ['organizacoes'],
      },
    })
    .json<BuscarOrganizacoesResponse>()

  return result
}
