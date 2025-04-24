import { Role } from '@agendamento-saas/auth'

import { api } from './api-client'

interface BuscarAfiliacaoResponse {
  afiliacao: {
    id: string
    role: Role
    tipo: 'CLIENTE' | 'FUNCIONARIO'
    organizacaoId: string
    usuarioId: string
  }
}

export async function BuscarAfiliacao(org: string) {
  const result = await api
    .get(`organizacao/${org}/afiliacao`)
    .json<BuscarAfiliacaoResponse>()

  return result
}
