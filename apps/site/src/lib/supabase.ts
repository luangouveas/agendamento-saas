import { env } from '@agendamento-saas/env'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY)
