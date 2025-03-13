import { api } from './api-client'

interface BuscarPerfilResponse {
  usuario: {
    id: string
    nome: string
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
