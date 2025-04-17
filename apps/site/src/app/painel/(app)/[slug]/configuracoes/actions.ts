'use server'

import { HTTPError } from 'ky'

import { desativarOrganizacao } from '@/http/desativar-organizacao'

export async function DesativarOrganizacaoAction(slug: string) {
  try {
    await desativarOrganizacao(slug!)
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

  return {
    success: true,
    message: 'Estabelecimento excluído com sucesso.',
  }
}
