import { api } from './api-client'

interface BuscarMembrosResponse {
  membros: {
    id: string
    nome: string
    avatarUrl: string | null
    role: 'ADMIN' | 'ATENDENTE' | 'CLIENTE' | 'FINANCEIRO' | 'RECEPCIONISTA'
    tipo: 'CLIENTE' | 'FUNCIONARIO'
    usuarioId: string
    numeroCelular: string
    email: string | null
  }[]
}

interface BuscarMembrosRequest {
  slug: string
  tipo?: 'FUNCIONARIO' | 'CLIENTE'
}

export async function buscarMembros({ slug, tipo }: BuscarMembrosRequest) {
  const base = `organizacao/${slug}/membros`
  const query = tipo ? `?tipo=${tipo}` : ''
  const url = base + query

  const result = await api.get(url).json<BuscarMembrosResponse>()

  return result
}
