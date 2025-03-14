import { api } from './api-client'

export interface BuscarPerfilResponse {
  usuario: {
    id: string
    nome: string | null
    dataNascimento: string | null
    email: string | null
    numeroCelular: string
    avatarUrl: string | null
    cep: string | null
    rua: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
  }
}

export async function buscarPerfil() {
  const result = await api.get('perfil').json<BuscarPerfilResponse>()

  return result
}
