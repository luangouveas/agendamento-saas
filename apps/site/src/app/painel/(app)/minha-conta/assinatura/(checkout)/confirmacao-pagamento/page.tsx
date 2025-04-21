import { AlertTriangle, ChevronLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Stripe from 'stripe'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { atualizarAssinaturaPROAction } from '../../actions'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId!)
    return session
  } catch (error) {
    return null
  }
}

function exibirAlertaErro(mensagem: string) {
  return (
    <div className="mt-8 flex w-full justify-center">
      <div className="w-[600px]">
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            <p>{mensagem}</p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default async function CheckoutReturnPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const sessionId = searchParams?.session_id

  if (!sessionId || typeof sessionId !== 'string') {
    return exibirAlertaErro(
      'Ocorreu um erro inesperado. Por favor contate o suporte técnico!',
    )
  }
  const session = await getSession(sessionId)

  if (!session) {
    return exibirAlertaErro(
      'Ocorreu um erro inesperado. Por favor contate o suporte técnico!',
    )
  }

  if (session?.status === 'open') {
    return exibirAlertaErro('O pagamento ainda está em aberto.')
  }

  if (session?.status === 'complete') {
    const customerId = session.customer as string
    const subscriprionId = session.subscription as string

    const { success, message } = await atualizarAssinaturaPROAction(
      customerId,
      subscriprionId,
    )

    if (!success) {
      return exibirAlertaErro(message)
    }

    return (
      <div className="mt-10 flex w-full justify-center">
        <Card className="max-w-lg">
          <CardContent className="">
            <CardHeader className="text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <CardTitle>Assinatura Confirmada!</CardTitle>
              <CardDescription>
                Sua assinatura foi processada com sucesso e sua conta{' '}
                <span className="font-semibold">PRO</span> está ativa agora.
              </CardDescription>
            </CardHeader>
            <div className="text-center text-gray-700">
              <p>
                Aproveite para cadastrar mais estabelecimentos, serviços e
                profissionais.
              </p>

              <Link
                href="/painel/minha-conta/assinatura"
                className={cn(buttonVariants({ variant: 'link' }), 'mt-12')}
              >
                <ChevronLeft className="mr-2 size-5" />
                Ver minha nova assinatura
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
