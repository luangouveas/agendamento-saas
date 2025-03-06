import { api } from './api-client'

interface RequisitarCodigoVerificacaoRequest {
  telefone: string
}

export async function requisitarCodigoVerificacao({
  telefone,
}: RequisitarCodigoVerificacaoRequest) {
  const result = await api
    .post('auth/request-otp', {
      json: {
        telefone,
      },
    })
    .json()

  return result
}
