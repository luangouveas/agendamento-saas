'use server'

import { addHours, addMinutes, startOfDay } from 'date-fns'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { BuscarAgendamentos } from '@/http/buscar-agendamentos'
import { buscarPerfil } from '@/http/buscar-perfil'
import { CancelarAgendamento } from '@/http/cancelar-agendamento'
import { ConcluirAgendamento } from '@/http/concluir-agendamento'

import { createQueryStringAgendamentos } from '../utils'

export async function BuscarAgendamentosAction(data?: Date) {
  try {
    const slug = await getSlugOrganizacaoAtual()
    const { usuario } = await buscarPerfil()

    const inicio = addMinutes(startOfDay(data ?? new Date()), -180)
    const fim = addHours(inicio, 24)

    const parms = createQueryStringAgendamentos({
      profissionalId: usuario.id,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      status: 'AGENDADO',
    })

    const { agendamentos } = await BuscarAgendamentos(slug!, parms)

    return {
      success: true,
      message: null,
      agendamentos,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        agendamentos: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      agendamentos: null,
    }
  }
}

export async function FinalizarAtendimentoAction(agendamentoId: string) {
  try {
    const slug = await getSlugOrganizacaoAtual()

    await ConcluirAgendamento({
      id: agendamentoId,
      slug: slug!,
    })

    return {
      success: true,
      message: 'Atendimento finalizado com sucesso.',
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
    }
  }
}

export async function CancelarAgendamentoAction(agendamentoId: string) {
  try {
    const slug = await getSlugOrganizacaoAtual()

    await CancelarAgendamento({
      id: agendamentoId,
      slug: slug!,
    })

    return {
      success: true,
      message: 'Agendamento cancelado com sucesso.',
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
    }
  }
}
