'use server'

import { HTTPError } from 'ky'

import { buscarProfissionais } from '@/http/buscar-profissionais'

export async function consultarListaDeProfissionaisDaOrganizacao(slug: string) {
  try {
    const { profissionais } = await buscarProfissionais(slug)

    return { success: true, message: null, data: profissionais }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, data: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      data: null,
    }
  }
}
