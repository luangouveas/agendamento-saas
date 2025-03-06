'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'

import { entrarComCodigoVerificacao } from '@/http/entrar-com-codigo-verificacao'
import { requisitarCodigoVerificacao } from '@/http/requisitar-codigo-verificacao'

export async function solicitarEntrarComTelefone(telefone: string) {
  try {
    const result = await requisitarCodigoVerificacao({
      telefone,
    })

    console.log(result)

    return { success: true, message: null }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
    }
  }
}

export async function entrarComTelefone(
  telefone: string,
  codigo: number,
  slug: string,
) {
  try {
    const { token } = await entrarComCodigoVerificacao({
      telefone,
      codigo,
      slug,
    })
    console.log(token)

    const ck = await cookies()

    ck.set('agendador-token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    ck.set('agendador-organizacao', slug)

    return { success: true, message: null }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
    }
  }
}
