import { revalidateTag } from 'next/cache'

import { api } from './api-client'

export interface AtualizarPerfilRequest {
  slug: string
  nome: string
  email?: string
  avatarUrl?: string
  numeroCelular: string
}

type AtualizarPerfilResponse = void

export async function AtualizarDadosPerfil(
  dadosPerfil: AtualizarPerfilRequest,
): Promise<AtualizarPerfilResponse> {
  await api.put(`organizacao/${dadosPerfil.slug}/perfil`, {
    json: {
      nome: dadosPerfil.nome,
      email: dadosPerfil.email,
      numeroCelular: dadosPerfil.numeroCelular,
      avatarUrl: dadosPerfil.avatarUrl,
    },
  })

  revalidateTag('atualizou-perfil')
}
