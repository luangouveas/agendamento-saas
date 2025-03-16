import { api } from './api-client'

export interface DadosUsuario {
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
interface BuscarPerfilResponse {
  usuario: DadosUsuario
}

export async function buscarPerfil() {
  const result = await api
    .get('perfil', {
      next: {
        tags: ['atualizou-perfil'],
      },
    })
    .json<BuscarPerfilResponse>()

  return result
}
