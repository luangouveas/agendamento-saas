'use server'

import { HTTPError } from 'ky'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { BuscarAgendamentos } from '@/http/buscar-agendamentos'
import { CancelarAgendamento } from '@/http/cancelar-agendamento'
import { ConfirmarAgendamento } from '@/http/confirmar-agendamento'

interface BuscarMeusAgendamentosAction {
  clienteId: string
  profissionalId?: string
  inicio?: string
  fim?: string
  status?:
    | 'AGENDADO'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'CONCLUIDO'
    | 'PENDENTE'
    | 'NAO_PENDENTE'
}

function createQueryString(filtros: BuscarMeusAgendamentosAction): string {
  const queryParams = new URLSearchParams()
  queryParams.append('clienteId', filtros.clienteId)
  if (filtros.profissionalId)
    queryParams.append('profissionalId', filtros.profissionalId)
  if (filtros.inicio) queryParams.append('inicio', filtros.inicio)
  if (filtros.fim) queryParams.append('fim', filtros.fim)
  if (filtros.status) queryParams.append('status', filtros.status)
  return queryParams.toString()
}

export async function buscarMeusAgendamentosAction(
  filtros: BuscarMeusAgendamentosAction,
) {
  try {
    const slug = await getSlugOrganizacaoAtual()
    const parms = createQueryString(filtros)

    const { agendamentos } = await BuscarAgendamentos(slug!, parms)
    return {
      success: true,
      message: null,
      data: agendamentos,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        data: null,
      }
    }

    console.error(err.message)

    return {
      success: false,
      message: 'Erro inesperado! Tente novamente em alguns instantes.',
      data: null,
    }
  }
}

export async function confirmarAgendamentoAction(id: string) {
  try {
    const slug = await getSlugOrganizacaoAtual()

    await ConfirmarAgendamento({ id, slug: slug! })

    return {
      success: true,
      message: null,
      data: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, data: null }
    }

    return {
      success: true,
      message: null,
      data: null,
    }
  }
}

export async function cancelarAgendamentoAction(id: string) {
  try {
    const slug = await getSlugOrganizacaoAtual()

    await CancelarAgendamento({ id, slug: slug! })

    return {
      success: true,
      message: null,
      data: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, data: null }
    }

    return {
      success: true,
      message: null,
      data: null,
    }
  }
}
