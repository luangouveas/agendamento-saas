'use server'

import { HTTPError } from 'ky'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { buscarPerfil } from '@/http/buscar-perfil'
import { buscarProfissionalPorId } from '@/http/buscar-profissional'
import { buscarServicoPorId } from '@/http/buscar-servico'
import { criarAgendamento } from '@/http/criar-agendamento'

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

interface DadosCriarAgendamento {
  profissionalId: string
  servicoId: string
  dataHora: string
  valor: number
}

export async function finalizarAgendamento(
  dadosAgendamento: DadosCriarAgendamento,
) {
  try {
    const slug = await getSlugOrganizacaoAtual()
    const { usuario } = await buscarPerfil()

    await criarAgendamento({
      clienteId: usuario.id,
      slug: slug!,
      profissionalId: dadosAgendamento.profissionalId,
      servicoId: dadosAgendamento.servicoId,
      dataHora: dadosAgendamento.dataHora,
      valor: dadosAgendamento.valor,
    })

    return { success: true, message: 'Agendamento realizado com sucesso!' }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message }
    }
  }
}
