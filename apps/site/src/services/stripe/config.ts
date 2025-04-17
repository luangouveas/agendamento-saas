import { env } from '@agendamento-saas/env'

export const config = {
  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABE_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
    plans: {
      free: {
        name: 'FREE',
        priceId: '',
        quota: { estabelecimentos: 1, servicos: 3, profissionais: 2 },
      },
      pro: {
        name: 'PRO',
        priceId: env.STRIPE_PLAN_PRICE_PRO_ID,
        quota: { estabelecimentos: 5, servicos: 50, profissionais: 10 },
      },
    },
  },
}
