import { api } from './api-client'

interface CriarAfiliacaoRequest {
  slug: string
  usuarioId: string
  role: string
  tipo: string
}

interface CriarAfiliacaoResponse {
  membroId: string
}

export async function CriarAfiliacaoUsuarioEmpresa({
  slug,
  role,
  usuarioId,
  tipo,
}: CriarAfiliacaoRequest) {
  const result = api
    .post(`organizacao/${slug}/membro`, {
      json: {
        usuarioId,
        role,
        tipo,
      },
    })
    .json<CriarAfiliacaoResponse>()

  return result
}
