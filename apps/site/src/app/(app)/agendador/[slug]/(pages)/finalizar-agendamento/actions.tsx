'use server'

import { HTTPError } from 'ky'

import { buscarProfissionalPorId } from '@/http/buscar-profissional'
import { buscarServicoPorId } from '@/http/buscar-servico'

export async function buscarDadosDoAgendamentoParaFinalizar(
  slug: string,
  servicoId: string,
  profissionalId: string,
) {
  try {
    const { servico: dadosServico } = await buscarServicoPorId(slug, servicoId)
    const { profissional: dadosProfissional } = await buscarProfissionalPorId(
      slug,
      profissionalId,
    )

    return {
      success: true,
      message: null,
      data: { dadosServico, dadosProfissional },
    }
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
