import { revalidateTag } from 'next/cache'

import { api } from './api-client'

export interface AtualizarPerfilRequest {
  nome: string
  email?: string
  numeroCelular: string
  dataNascimento: string
  cep?: string
  rua?: string
  bairro?: string
  cidade?: string
  estado?: string
}

type AtualizarPerfilResponse = void

export async function AtualizarDadosPerfil(
  dadosPerfil: AtualizarPerfilRequest,
): Promise<AtualizarPerfilResponse> {
  await api.put(`perfil`, {
    json: {
      nome: dadosPerfil.nome,
      email: dadosPerfil.email,
      numeroCelular: dadosPerfil.numeroCelular,
      dataNascimento: dadosPerfil.dataNascimento,
      cep: dadosPerfil.cep,
      rua: dadosPerfil.rua,
      bairro: dadosPerfil.bairro,
      cidade: dadosPerfil.cidade,
      estado: dadosPerfil.estado,
    },
  })

  revalidateTag('atualizou-perfil')
}
