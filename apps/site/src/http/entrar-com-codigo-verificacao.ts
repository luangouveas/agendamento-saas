import { api } from './api-client'

interface EntrarComCodigoVerificacaoRequest {
  telefone: string
  codigo: number
  slug: string
}

interface EntrarComCodigoVerificacaoResponse {
  token: string
}

export async function entrarComCodigoVerificacao({
  telefone,
  codigo,
  slug,
}: EntrarComCodigoVerificacaoRequest): Promise<EntrarComCodigoVerificacaoResponse> {
  const result = await api
    .post(`${slug}/auth/otp`, {
      json: {
        telefone,
        tokenOtp: codigo,
      },
    })
    .json<EntrarComCodigoVerificacaoResponse>()

  return result
}
