'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { AtualizarDadosPerfil } from '@/http/atualizar-perfil'

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
