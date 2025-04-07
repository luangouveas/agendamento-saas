import { env } from '@agendamento-saas/env'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

import {
  handleProcessWebhookUpdatedSubscription,
  stripe,
} from '@/services/stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET,
    )
  } catch (error) {
    console.log(`Webhook Error: ${error.message}`)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const cookieStorte = await cookies()
  cookieStorte.set('ag-tk-admin', env.TOKEN_ADMIN)

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleProcessWebhookUpdatedSubscription(event.data)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new Response('{"recived": true}', { status: 200 })
}
