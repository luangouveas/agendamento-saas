import { api } from './api-client'

export interface AtualizarAssinaturaRequest {
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeSubscriptionStatus: string
  stripePriceId: string
}

type AtualizarAssinaturaResponse = void

export async function AtualizarAssinatura(
  data: AtualizarAssinaturaRequest,
): Promise<AtualizarAssinaturaResponse> {
  await api.put(`assinatura`, {
    json: {
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripeSubscriptionStatus: data.stripeSubscriptionStatus,
      stripePriceId: data.stripePriceId,
    },
  })
}

interface BuscarAssinanteRequest {
  stripeCustomerId: string
}

interface BuscarAssinanteResponse {
  assinante: {
    id: string
  }
}

export async function BuscarAssinante({
  stripeCustomerId,
}: BuscarAssinanteRequest) {
  const response = await api.get(`assinatura/assinante/${stripeCustomerId}`)
  return response.json<BuscarAssinanteResponse>()
}

interface BuscarAssinaturaUsuarioPorIdUsuarioResponse {
  assinatura: {
    id: string
    stripePriceId: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripeSubscriptionStatus: string
    totalEstabelecimentos: number
    totalServicos: number
    totalProfissionais: number
  }
}

export async function BuscarAssinaturaUsuarioPorIdUsuario() {
  const response = await api.get(`assinatura`)
  return response.json<BuscarAssinaturaUsuarioPorIdUsuarioResponse>()
}
