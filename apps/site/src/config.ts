import { env } from '@agendamento-saas/env'

export const config = {
  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABE_KEY,
    secretKey: env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    plans: {
      free: {
        priceId: env.NEXT_PUBLIC_STRIPE_PLAN_PRICE_FREE_ID,
        quota: { estabelecimentos: 1, servicos: 3 },
      },
      pro: {
        priceId: env.NEXT_PUBLIC_STRIPE_PLAN_PRICE_PRO_ID,
        quota: { estabelecimentos: 5, servicos: 150 },
      },
    },
  },
}
