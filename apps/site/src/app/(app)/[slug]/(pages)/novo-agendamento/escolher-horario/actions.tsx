'use server'

import { HTTPError } from 'ky'

import { buscarHorariosDisponiveis } from '@/http/buscar-horarios-disponiveis'

export async function buscarListaDeHorariosDisponiveis(
  slug: string,
  servicoId: string,
  profissionalId: string,
  diaSugerido?: string,
) {
  try {
    const { diasDisponiveis } = await buscarHorariosDisponiveis(
      slug,
      servicoId,
      profissionalId,
      diaSugerido,
    )

    return { success: true, message: null, data: diasDisponiveis }
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
