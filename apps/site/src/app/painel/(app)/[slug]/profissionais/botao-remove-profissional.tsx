'use client'

import { Loader2, XOctagonIcon } from 'lucide-react'
import { ComponentProps, useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

import { removerMembroAction } from './actions'

interface BotaoRemoveMembroProfissionalProps
  extends ComponentProps<typeof Button> {
  membroId: string
}

export function BotaoRemoveMembroProfissional({
  membroId,
  ...props
}: BotaoRemoveMembroProfissionalProps) {
  const [isPending, setIsPending] = useState(false)

  async function removerProfissional() {
    setIsPending(true)
    const ret = await removerMembroAction(membroId)

    toast({
      variant: ret.success ? 'success' : 'destructive',
      title: ret.success ? 'Sucesso!' : 'Erro!',
      description: ret.message,
    })

    setIsPending(false)
  }

  return (
    <Button onClick={removerProfissional} disabled={isPending} {...props}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Removendo...
        </>
      ) : (
        <>
          <XOctagonIcon className="mr-2 size-4" />
          Remover associação
        </>
      )}
    </Button>
  )
}
