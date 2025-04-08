import { env } from '@agendamento-saas/env'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_SECRET_KEY,
)
