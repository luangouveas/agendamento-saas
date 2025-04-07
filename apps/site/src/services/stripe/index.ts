import Stripe from 'stripe'

import { config } from '@/config'
import {
  AtualizarAssinatura,
  BuscarAssinante,
  BuscarAssinaturaUsuarioPorIdUsuario,
} from '@/http/assinatura'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-03-31.basil',
  httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]
}

export const createStripeCustomer = async (input: {
  name?: string
  email: string
}) => {
  const customer = await getStripeCustomerByEmail(input.email)
  if (customer) return customer

  const createdCustomer = await stripe.customers.create({
    email: input.email,
    name: input.name,
  })

  const createdCustomerSubscription = await stripe.subscriptions.create({
    customer: createdCustomer.id,
    items: [{ price: config.stripe.plans.free.priceId }],
  })

  await AtualizarAssinatura({
    stripeCustomerId: createdCustomer.id,
    stripeSubscriptionId: createdCustomerSubscription.id,
    stripeSubscriptionStatus: createdCustomerSubscription.status,
    stripePriceId: config.stripe.plans.free.priceId,
  })

  return createdCustomer
}

export const createCheckoutSession = async (
  userEmail: string,
  userStripeSubscriptionId: string,
) => {
  try {
    const customer = await createStripeCustomer({
      email: userEmail,
    })

    const subscription = await stripe.subscriptionItems.list({
      subscription: userStripeSubscriptionId,
      limit: 1,
    })

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: 'http://localhost:3000/painel/minha-conta/assinatura',
      flow_data: {
        type: 'subscription_update_confirm',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: 'http://localhost:3000/painel',
          },
        },
        subscription_update_confirm: {
          subscription: userStripeSubscriptionId,
          items: [
            {
              id: subscription.data[0].id,
              price: config.stripe.plans.pro.priceId,
              quantity: 1,
            },
          ],
        },
      },
    })

    return {
      url: session.url,
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error to create checkout session')
  }
}

export const downgradePlanToFree = async (userStripeSubscriptionId: string) => {
  const subscription = await stripe.subscriptionItems.list({
    subscription: userStripeSubscriptionId,
    limit: 1,
  })

  const result = await stripe.subscriptions.update(userStripeSubscriptionId, {
    items: [
      {
        id: subscription.data[0].id,
        price: config.stripe.plans.free.priceId,
        quantity: 1,
      },
    ],
  })

  return result.status
}

export const handleProcessWebhookUpdatedSubscription = async (event: {
  object: Stripe.Subscription
}) => {
  const stripeCustomerId = event.object.customer as string
  const stripeSubscriptionId = event.object.id as string
  const stripeSubscriptionStatus = event.object.status
  const stripePriceId = event.object.items.data[0].price.id

  // chamar a api
  const { assinante } = await BuscarAssinante({ stripeCustomerId })

  if (!assinante) {
    throw new Error('user of stripeCustomerId not found')
  }

  await AtualizarAssinatura({
    stripeCustomerId,
    stripeSubscriptionId,
    stripeSubscriptionStatus,
    stripePriceId,
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

  if (!assinatura || !assinatura.stripePriceId) {
    throw new Error('User or user stripePriceId not found')
  }

  const plan = getPlanByPrice(assinatura.stripePriceId)

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
