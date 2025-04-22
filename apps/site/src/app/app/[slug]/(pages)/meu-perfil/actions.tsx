'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { AtualizarDadosPerfil } from '@/http/atualizar-perfil'

const perfilUsuarioSchema = z.object({
  nome: z.string().min(3, {
    message: 'O nome é obrigatório.',
  }),
  ddi: z.string().min(1, { message: 'Selecione um DDI da lista.' }),
  email: z.string().email('E-mail inválido.').optional(),
  numeroCelular: z.string().min(5, {
    message: 'O número do celular é obrigatório.',
  }),
  dataNascimento: z
    .string()
    .min(1, { message: 'Data de nascimento é obrigatória.' })
    .date('Data inválida.'),
})

export async function atualizarDadosDoPerfilDoUsuario(formData: FormData) {
  const resultParse = perfilUsuarioSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!resultParse.success) {
    return {
      success: false,
      message: 'Verifique se os dados fornecidos são válidos.',
      errors: resultParse.error.flatten().fieldErrors,
    }
  }

  try {
    const { numeroCelular, ddi, ...data } = resultParse.data

    const numero = numeroCelular.replace(/[ ()-]/g, '')
    const codigoDdi = ddi.split(' ')[1]
    const ddiNumeroCelular = `${codigoDdi} ${numero}`

    await AtualizarDadosPerfil({
      numeroCelular: ddiNumeroCelular,
      ...data,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Perfil atualizado com sucesso.',
    errors: null,
  }
}
