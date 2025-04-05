'use server'

import { HTTPError } from 'ky'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import {
  AtualizarDadosPerfil,
  AtualizarPerfilRequest,
} from '@/http/atualizar-perfil'

export async function atualizarDadosDoPerfilDoUsuario(
  dadosPerfilForm: Omit<AtualizarPerfilRequest, 'slug'>,
) {
  try {
    const slug = await getSlugOrganizacaoAtual()

    const dadosPerfil = {
      slug: slug!,
      ...dadosPerfilForm,
    }

    await AtualizarDadosPerfil(dadosPerfil)

    return {
      success: true,
      message: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
    }
  }
}
