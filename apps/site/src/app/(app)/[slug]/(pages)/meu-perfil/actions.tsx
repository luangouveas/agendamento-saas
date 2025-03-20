'use server'

import { HTTPError } from 'ky'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import {
  AtualizarDadosPerfil,
  AtualizarPerfilRequest,
} from '@/http/atualizar-perfil'
import { supabase } from '@/lib/supabase'

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

export async function uploadAvatarAction(idClinte: string, avatarFile: File) {
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`usuarios/${idClinte}.png`, avatarFile, {
      cacheControl: '3600',
      upsert: false,
    })

  return { data, error }
}
