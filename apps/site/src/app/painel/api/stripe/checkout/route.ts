import { env } from '@agendamento-saas/env'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { getStripeCustomerByEmail } from '@/services/stripe'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  try {
    const dataForm = await request.formData()
    const emailUsuario: string = dataForm.get('emailUsuario') as string

    const customer = await getStripeCustomerByEmail(emailUsuario)

    // 'salvar o id do customer e nao apagar mais do banco para nao criar outro cliente no stripe // ajustar a rota de cancelamento para nao apagar esse dado // ajustar as rotas para passar esse dado ate aqui',

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      customer_email: customer ? undefined : emailUsuario,
      customer: customer ? customer.id : undefined,
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

    console.log(session)

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    })
  } catch (err) {
    return Response.json(err.message, {
      status: 400,
    })
  }
}
