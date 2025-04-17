'use server'

import { getTime } from 'date-fns'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { AtualizarAvatarUrl } from '@/http/atualizar-avatar'
import { AtualizarDadosPerfil } from '@/http/atualizar-perfil'
import { supabase } from '@/lib/supabase'

const perfilUsuarioSchema = z.object({
  nome: z.string({ message: '' }),
  numeroCelular: z.string(),
  dataNascimento: z.string().date(),
  cep: z.string(),
  rua: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
})

export async function AtualizarPerfilUsuarioAction(formData: FormData) {
  const resultParse = perfilUsuarioSchema.safeParse(
    Object.fromEntries(formData),
  )

  console.log(Object.fromEntries(formData))

  if (!resultParse.success) {
    return {
      success: false,
      message: 'Verifique os campos',
      errors: resultParse.error.flatten().fieldErrors,
    }
  }

  try {
    resultParse.data.numeroCelular = `+55 ${resultParse.data.numeroCelular}`
    await AtualizarDadosPerfil(resultParse.data)
    revalidateTag('atualizou-perfil')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message, errors } = await err.response.json()

      return {
        success: false,
        message: `${message} - ${errors}`,
        errors,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado!',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Perfil atualizado com sucesso!',
    errors: null,
  }
}

export async function UploadAvatarUsuarioAction(
  idUsuario: string,
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
      .upload(`usuarios/${idUsuario}-${timestamp}`, file, {
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
      .getPublicUrl(`usuarios/${idUsuario}-${timestamp}`)

    await AtualizarAvatarUrl({
      avatarUrl: data.publicUrl,
      id: idUsuario,
      tipo: 'usuarios',
    })

    if (avatarUrlAntiga) {
      const arrUrl = avatarUrlAntiga.split('/')
      await supabase.storage
        .from('avatars')
        .remove([`usuarios/${arrUrl[arrUrl.length - 1]}`])
    }

    revalidateTag('atualizou-perfil')

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
