import Stripe from 'stripe'

import {
  AtualizarAssinatura,
  BuscarAssinaturaUsuarioPorIdUsuario,
} from '@/http/assinatura'
import { config } from '@/services/stripe/config'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-03-31.basil',
  httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]
}

export const getSubscriptionByCustomerId = async (stripeCustomerId: string) => {
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
  })
  return subscriptions.data[0]
}

export const buscarCartosDeCreditoCliente = async (customerId: string) => {
  const cartoes = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  })

  return cartoes
}

export const atualizarAssinaturaUsuario = async (
  customerId: string,
  subscriptionId: string,
) => {
  const subscription = await getSubscriptionByCustomerId(customerId)

  if (!subscription) {
    throw new Error('Assinatura não localizada.')
  }

  await AtualizarAssinatura({
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    stripeSubscriptionStatus: subscription.status,
    stripePriceId: subscription.items.data[0].price.id,
  })
}

export const cancelarAssinaturaUsuario = async (customerId: string) => {
  const subscription = await getSubscriptionByCustomerId(customerId)

  await stripe.subscriptions.cancel(subscription.id)

  await AtualizarAssinatura({
    stripeCustomerId: customerId,
    stripeSubscriptionId: null,
    stripeSubscriptionStatus: null,
    stripePriceId: null,
  })
}

export const cancelarEstornarAssinaturaUsuario = async (customerId: string) => {
  const subscription = await getSubscriptionByCustomerId(customerId)
  const paymentIntent = await stripe.paymentIntents.list({
    customer: customerId,
  })

  await stripe.refunds.create({
    payment_intent: paymentIntent.data[0].id,
  })

  await stripe.subscriptions.cancel(subscription.id)

  await AtualizarAssinatura({
    stripeCustomerId: customerId,
    stripeSubscriptionId: null,
    stripeSubscriptionStatus: null,
    stripePriceId: null,
  })
}

type Plan = {
  priceId: string
  quota: {
    estabelecimentos: number
    servicos: number
    profissionais: number
  }
}

type Plans = {
  [key: string]: Plan
}

export const getPlanByPrice = (priceId: string) => {
  const plans: Plans = config.stripe.plans

  const planKey = Object.keys(plans).find(
    (key) => plans[key].priceId === priceId,
  ) as keyof Plans | undefined

  const plan = planKey ? plans[planKey] : null

  if (!plan) {
    throw new Error(`Plan not found for priceId: ${priceId}`)
  }

  return {
    name: planKey,
    quota: plan.quota,
  }
}

export const getPrice = async (priceId: string) => {
  const prices = await stripe.prices.list()
  const price = prices.data.find((p) => p.id === priceId)

  if (!price) {
    throw new Error('Não foi possivel localizar o preço da assinatura')
  }

  return {
    valor: price.unit_amount_decimal,
    ativo: price.active,
  }
}

export const getUserCurrentPlan = async () => {
  const { assinatura } = await BuscarAssinaturaUsuarioPorIdUsuario()
  let plan

  if (!assinatura.stripeSubscriptionId) {
    plan = config.stripe.plans.free
  } else {
    plan = config.stripe.plans.pro
  }

  const availableEstabelecimentos = plan.quota.estabelecimentos
  const currentEstabelecimentos = assinatura.totalEstabelecimentos
  const usageEstabelecimentos =
    (currentEstabelecimentos / availableEstabelecimentos) * 100

  const availableServicos = plan.quota.servicos
  const currentServicos = assinatura.totalServicos
  const usageServicos = (currentServicos / availableServicos) * 100

  const availableProfissionais = plan.quota.profissionais
  const currentProfissionais = assinatura.totalProfissionais
  const usageProfissionais =
    (currentProfissionais / availableProfissionais) * 100

  return {
    name: plan.name,
    quota: {
      estabelecimentos: {
        available: availableEstabelecimentos,
        current: currentEstabelecimentos,
        usageEstabelecimentos,
      },
      servicos: {
        available: availableServicos,
        current: currentServicos,
        usageServicos,
      },
      profissionais: {
        available: availableProfissionais,
        current: currentProfissionais,
        usageProfissionais,
      },
    },
  }
}
