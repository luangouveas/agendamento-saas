import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    SERVER_PORT: z.coerce.number().default(3031),
    TOKEN_ADMIN: z.string(),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SECRET_KEY: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABE_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_SECRET_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_PLAN_PRICE_FREE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PLAN_PRICE_PRO_ID: z.string(),
    NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_ADMIN: process.env.TOKEN_ADMIN,
    SERVER_PORT: process.env.SERVER_PORT,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABE_KEY,
    NEXT_PUBLIC_STRIPE_SECRET_KEY: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PLAN_PRICE_FREE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_PRICE_FREE_ID,
    NEXT_PUBLIC_STRIPE_PLAN_PRICE_PRO_ID:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_PRICE_PRO_ID,
    NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET:
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET,
  },
  emptyStringAsUndefined: true,
})
