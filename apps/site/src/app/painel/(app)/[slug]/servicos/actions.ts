'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { InativarServico } from '@/http/inativar-servico'

export async function InativarServicoAction(id: string) {
  const slug = await getSlugOrganizacaoAtual()

  try {
    await InativarServico({ id, slug: slug! })
    revalidateTag(`${slug}/servicos`)
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
    message: 'Serviço excluido com sucesso.',
  }
}
