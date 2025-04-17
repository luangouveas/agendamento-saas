'use server'

import { getTime } from 'date-fns'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { currency } from 'remask'
import { z } from 'zod'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { AtualizarAvatarUrl } from '@/http/atualizar-avatar'
import { AtualizarServico } from '@/http/atualizar-servico'
import { CriarServico } from '@/http/criar-servico'
import { supabase } from '@/lib/supabase'

const servicoSchema = z.object({
  id: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
  nome: z.string().min(1, { message: 'Nome do serviço é obrigatório' }),
  descricao: z
    .string()
    .min(1, { message: 'Descrição do serviço é obrigatório' }),
  valor: z.coerce
    .string()
    .min(1, { message: 'Valor do serviço é obrigatório' })
    .transform((val) => {
      const valorTratado = currency.unmask({
        locale: 'pt-BR',
        currency: 'BRL',
        value: val,
      })
      return Number(valorTratado)
    }),
  tempo: z.coerce
    .number()
    .positive('O tempo deve ser maior que 0')
    .min(1, { message: 'Tempo do serviço é obrigatório' }),
})

export type ServicoSchema = z.infer<typeof servicoSchema>

export async function criarServicoAction(data: FormData) {
  const slug = await getSlugOrganizacaoAtual()

  const resultParse = servicoSchema.safeParse(Object.fromEntries(data))

  if (!resultParse.success) {
    return {
      success: false,
      message: 'Erro de validação nos campos',
      errors: resultParse.error.flatten().fieldErrors,
    }
  }

  try {
    await CriarServico(resultParse.data, slug!)

    revalidateTag(`${slug}/servicos`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.log(err)

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Serviço criado com sucesso!',
    errors: null,
  }
}

export async function atualizarServicoAction(data: FormData) {
  const slug = await getSlugOrganizacaoAtual()

  const resultParse = servicoSchema.safeParse(Object.fromEntries(data))

  if (!resultParse.success) {
    return {
      success: false,
      message: 'Verifique os campos do formulário',
      errors: resultParse.error.flatten().fieldErrors,
    }
  }

  try {
    await AtualizarServico(resultParse.data, slug!, resultParse.data.id ?? '')

    revalidateTag(`${slug}/servicos`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Serviço atualizado com sucesso!',
    errors: null,
  }
}

const uploadSchema = z.object({
  idServico: z.string(),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Escolha um arquivo',
  }),
})

export async function UploadAvatarServicoAction(
  idServico: string,
  file: File,
  avatarUrlAntiga?: string | null,
) {
  const slug = await getSlugOrganizacaoAtual()

  const resultParse = uploadSchema.safeParse({ idServico, file })

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
      .upload(`servicos/${idServico}-${timestamp}`, file, {
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
      .getPublicUrl(`servicos/${idServico}-${timestamp}`)

    await AtualizarAvatarUrl({
      avatarUrl: data.publicUrl,
      id: idServico,
      tipo: 'servicos',
    })

    if (avatarUrlAntiga) {
      const arrUrl = avatarUrlAntiga.split('/')
      console.log(arrUrl)
      console.log(arrUrl.length - 1)
      console.log(`excluir: servicos/${arrUrl[arrUrl.length - 1]}`)
      await supabase.storage
        .from('avatars')
        .remove([`servicos/${arrUrl[arrUrl.length - 1]}`])
    }

    revalidateTag(`${slug}/servicos`)

    return {
      success: true,
      message: 'Avatar enviado com suecsso.',
      imageUrl: 'data.publicUrl',
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
