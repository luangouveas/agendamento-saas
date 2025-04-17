'use server'

import { getTime } from 'date-fns'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { AtualizarAvatarUrl } from '@/http/atualizar-avatar'
import { supabase } from '@/lib/supabase'

interface UploadAvatarActionParms {
  tipoRegistro: 'estabelecimentos' | 'usuarios' | 'servicos'
  idRegistro: string
  file: File
  avatarUrlAtual?: string | null
  nomeTagRevalidar?: string
}

export async function UploadAvatarAction({
  tipoRegistro,
  idRegistro,
  file,
  avatarUrlAtual,
  nomeTagRevalidar,
}: UploadAvatarActionParms) {
  const fileSchema = z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Escolha um arquivo válido.',
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
      .upload(`${tipoRegistro}/${idRegistro}-${timestamp}`, file, {
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
      .getPublicUrl(`${tipoRegistro}/${idRegistro}-${timestamp}`)

    await AtualizarAvatarUrl({
      avatarUrl: data.publicUrl,
      id: idRegistro,
      tipo: tipoRegistro,
    })

    if (avatarUrlAtual) {
      const arrUrl = avatarUrlAtual.split('/')
      await supabase.storage
        .from('avatars')
        .remove([`${tipoRegistro}/${arrUrl[arrUrl.length - 1]}`])
    }

    if (nomeTagRevalidar) {
      revalidateTag(nomeTagRevalidar)
    }

    return {
      success: true,
      message: 'Avatar enviado com suecsso.',
      imageUrl: data.publicUrl,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        imageUrl: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      imageUrl: null,
    }
  }
}
