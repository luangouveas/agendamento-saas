'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { BuscarAssinaturaUsuarioPorIdUsuario } from '@/http/assinatura'
import * as stripeService from '@/services/stripe'

export async function atualizarAssinaturaPROAction() {
  const { assinatura } = await BuscarAssinaturaUsuarioPorIdUsuario()

  const checkoutSession = await stripeService.createCheckoutSession(
    assinatura.email,
    assinatura.stripeSubscriptionId,
  )

  redirect(checkoutSession.url)
}

export async function atualizarAssinaturaFREEAction() {
  try {
    const { assinatura } = await BuscarAssinaturaUsuarioPorIdUsuario()

    await stripeService.downgradePlanToFree(assinatura.stripeSubscriptionId)

    revalidateTag('assinatura-usuario')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }
    return {
      success: false,
      message: 'Houve um erro inesperado ao tentar atualizar a sua assinatura.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Sua assinatura foi atualizada!',
    errors: null,
  }
}
