'use client'

import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

import { CancelarAgendamentoAction } from './actions'

interface BotaoCancelarAgendamentoProps {
  agendamentoId: string
}

export default function BotaoCancelarAgendamento({
  agendamentoId,
}: BotaoCancelarAgendamentoProps) {
  const [isPending, setIsPending] = useState(false)

  async function cancelarAgendamentoHandle() {
    setIsPending(true)
    const { message, success } = await CancelarAgendamentoAction(agendamentoId)

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
      variant="destructive"
      onClick={cancelarAgendamentoHandle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin sm:mr-2" />
      ) : (
        <XCircle className="size-4 sm:mr-2" />
      )}

      <span className="hidden sm:block">
        {isPending ? 'Cancelando...' : 'Carncelar'}
      </span>
    </Button>
  )
}
