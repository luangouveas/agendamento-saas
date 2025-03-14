import { api } from './api-client'

export interface AtualizarPerfilRequest {
  slug: string
  nome: string
  email?: string
  avatarUrl?: string
  numeroCelular: string
}

export async function AtualizarPerfil(dadosPerfil: AtualizarPerfilRequest) {
  await api
    .put(`organizacao/${dadosPerfil.slug}/perfil`, {
      json: {
        nome: dadosPerfil.nome,
        email: dadosPerfil.email,
        numeroCelular: dadosPerfil.numeroCelular,
        avatarUrl: dadosPerfil.avatarUrl,
      },
    })
    .json()
}
