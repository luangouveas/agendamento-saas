import { brasilApi } from './api'

interface ConsultarCepRequest {
  cep: number
}

interface ConsultarCepResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

export async function ConsultarCEP({ cep }: ConsultarCepRequest) {
  const result = await brasilApi
    .get(`cep/v1/${cep}`)
    .json<ConsultarCepResponse>()

  return result
}
