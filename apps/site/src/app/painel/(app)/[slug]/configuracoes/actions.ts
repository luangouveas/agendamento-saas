'use server'

import { getTime } from 'date-fns'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { AtualizarAvatarUrl } from '@/http/atualizar-avatar'
import { desativarOrganizacao } from '@/http/desativar-organizacao'
import { supabase } from '@/lib/supabase'

export async function DesativarOrganizacaoAction(slug: string) {
  try {
    await desativarOrganizacao(slug!)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
    }
  }

  return {
    success: true,
    message: 'Estabelecimento excluído com sucesso.',
  }
}

export async function UploadAvatarOrganizacaoAction(
  idOrganizacao: string,
  file: File,
  avatarUrlAntiga?: string | null,
) {
  const fileSchema = z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Escolha um arquivo',
  })
  const resultParse = fileSchema.safeParse(file)

  if (!resultParse.success) {
    return {
      success: false,
      message: 'Verifique se o arquivo escolhido é uma imagem válida.',
      imageUrl: null,
    }
  }

  try {
    const timestamp = getTime(new Date())
    const { error } = await supabase.storage
      .from('avatars')
      .upload(`estabelecimentos/${idOrganizacao}-${timestamp}`, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      return {
        success: false,
        message: error.message,
        imageUrl: null,
      }
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(`estabelecimentos/${idOrganizacao}-${timestamp}`)

    await AtualizarAvatarUrl({
      avatarUrl: data.publicUrl,
      id: idOrganizacao,
      tipo: 'estabelecimentos',
    })

    if (avatarUrlAntiga) {
      const arrUrl = avatarUrlAntiga.split('/')
      await supabase.storage
        .from('avatars')
        .remove([`estabelecimentos/${arrUrl[arrUrl.length - 1]}`])
    }

    revalidateTag('organizacoes')

    return {
      success: true,
      message: 'Avatar enviado com suecsso.',
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
    }
  }
}
