'use client'

import { env } from '@agendamento-saas/env'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type BotaoPagamentoProps = {
  children: React.ReactNode
  className?: string
  emailUsuario: string
}

export default function BotaoPagamento({
  children,
  className,
  emailUsuario,
}: BotaoPagamentoProps) {
  const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABE_KEY)

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session

    const formData = new FormData()
    formData.set('emailUsuario', emailUsuario)

    return fetch('/painel/api/stripe/checkout', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => data.client_secret)
  }, [])

  const options = { fetchClientSecret }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="submit" formMethod="post" className={className}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <>
          <DialogTitle>Assinatura PRO</DialogTitle>
          <ScrollArea>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout className="max-h-[80dvh]" />
            </EmbeddedCheckoutProvider>
          </ScrollArea>
        </>
      </DialogContent>
    </Dialog>
  )
}
