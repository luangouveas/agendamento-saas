import { env } from '@agendamento-saas/env'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  try {
    const dataForm = await request.formData()
    const emailUsuario: string = dataForm.get('emailUsuario') as string

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      customer_email: emailUsuario,
      line_items: [
        {
          // this is the product price id from stripe
          price: env.STRIPE_PLAN_PRICE_PRO_ID,
          quantity: 1,
        },
      ],

      payment_method_types: ['card'],
      mode: 'subscription',
      return_url: `${request.headers.get(
        'origin',
      )}/painel/minha-conta/assinatura/confirmacao-pagamento?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    })
  } catch (err) {
    return Response.json(err, {
      status: 400,
    })
  }
}
