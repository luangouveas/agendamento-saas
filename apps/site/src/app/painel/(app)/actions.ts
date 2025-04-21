'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { AtualizarOrganizacao } from '@/http/atualizar-organizacao'
import { CriarOrganizacao } from '@/http/criar-organizacao'

const organizacaoSchema = z.object({
  cnpj: z
    .string()
    .min(18, 'CNPJ deve deve conter 14 digitos')
    .max(18, 'CNPJ deve conter 14 digitos'),
  razaoSocial: z.string().min(1, 'Campo obrigatório'),
  nome: z.string().min(1, 'Campo obrigatório'),
  rua: z.string().min(1, 'Campo obrigatório'),
  bairro: z.string().min(1, 'Campo obrigatório'),
  cidade: z.string().min(1, 'Campo obrigatório'),
  estado: z.string().min(1, 'Campo obrigatório'),
  cep: z.string().min(1, 'Campo obrigatório'),
})

export type OrganizacaoType = z.infer<typeof organizacaoSchema>

export async function criarOrganizacao(formData: FormData) {
  const resultSchema = organizacaoSchema.safeParse(Object.fromEntries(formData))

  if (!resultSchema.success) {
    return {
      success: false,
      message: 'Erro de validação nos campos do formulário',
      errors: resultSchema.error.flatten().fieldErrors,
    }
  }

  try {
    await CriarOrganizacao(resultSchema.data)
    revalidateTag('organizacoes')
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
      message: 'Erro inesperado!',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Estabelecimento criado com sucesso!',
    errors: null,
  }
}

export async function atualizarOrganizacao(formData: FormData) {
  const slug = await getSlugOrganizacaoAtual()
  const resultSchema = organizacaoSchema.safeParse(Object.fromEntries(formData))

  if (!resultSchema.success) {
    return {
      success: false,
      message: 'Erro de validação nos campos do formulário',
      errors: resultSchema.error.flatten().fieldErrors,
    }
  }

  try {
    await AtualizarOrganizacao(resultSchema.data, slug!)
    revalidateTag('organizacoes')
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
    message: 'Estabelecimento atualizado com sucesso!',
    errors: null,
  }
}
