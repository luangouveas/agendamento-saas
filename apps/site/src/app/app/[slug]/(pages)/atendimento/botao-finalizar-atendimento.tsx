'use client'

import { CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

import { FinalizarAtendimentoAction } from './actions'

interface BotaoFinalizarAtendimentoProps {
  agendamentoId: string
}

export default function BotaoFinalizarAtendimento({
  agendamentoId,
}: BotaoFinalizarAtendimentoProps) {
  const [isPending, setIsPending] = useState(false)

  async function finalizarAtendimentoHandle() {
    setIsPending(true)
    const { message, success } = await FinalizarAtendimentoAction(agendamentoId)

    toast({
      variant: success ? 'success' : 'destructive',
      title: success ? 'Sucesso!' : 'Erro!',
      description: message,
    })

    setIsPending(false)
  }

  return (
    <Button
      className="text-xs"
      size="sm"
      variant="success"
      onClick={finalizarAtendimentoHandle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin sm:mr-2" />
      ) : (
        <CheckCircle className="size-4 sm:mr-2" />
      )}

      <span className="hidden sm:block">
        {isPending ? 'Finalizando...' : 'Finalizar'}
      </span>
    </Button>
  )
}
