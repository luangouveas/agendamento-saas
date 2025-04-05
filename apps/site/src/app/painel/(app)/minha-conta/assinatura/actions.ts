'use server'

import * as stripeService from '@/services/stripe'

export async function criarSessaoDeAssinatura() {
  const meu_plano_atual = await stripeService.getUserCurrentPlan()
}
