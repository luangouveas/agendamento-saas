'use client'

import { Loader2, XOctagonIcon } from 'lucide-react'
import { ComponentProps, useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

import { cancelarConviteAction } from './actions'

interface BotaoCancelaConviteProps extends ComponentProps<typeof Button> {
  conviteId: string
}

export function BotaoCancelaConvite({
  conviteId,
  ...props
}: BotaoCancelaConviteProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleCancelarConvite() {
    setIsPending(true)
    const ret = await cancelarConviteAction(conviteId)

    toast({
      variant: ret.success ? 'success' : 'destructive',
      title: ret.success ? 'Sucesso!' : 'Erro!',
      description: ret.message,
    })

    setIsPending(false)
  }

  return (
    <Button onClick={handleCancelarConvite} {...props} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Cancelando...
        </>
      ) : (
        <>
          <XOctagonIcon className="mr-2 size-4" />
          Cancelar convite
        </>
      )}
    </Button>
  )
}
