import { api } from './api-client'

interface InativarServicoRequest {
  slug: string
  id: string
}

type InativarServicoResponse = void

export async function InativarServico({
  id,
  slug,
}: InativarServicoRequest): Promise<InativarServicoResponse> {
  await api.patch(`organizacao/${slug}/servico/${id}/inativar`)
}
