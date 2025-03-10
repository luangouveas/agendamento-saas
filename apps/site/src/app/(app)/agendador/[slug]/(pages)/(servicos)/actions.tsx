'use server'

import { HTTPError } from 'ky'

import { buscarServicos } from '@/http/buscar-servicos'

export async function consultarListaDeServicosDaOrganizacao(slug: string) {
  try {
    const { servicos } = await buscarServicos(slug)

    return { success: true, message: null, data: servicos }
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
