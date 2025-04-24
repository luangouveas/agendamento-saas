'use client'

import { CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

import {
  cancelarAgendamentoAction,
  confirmarAgendamentoAction,
} from './actions'

export default function AcaoAgendamentoForm({
  id,
  acao,
}: {
  id: string
  acao: 'confirmar' | 'cancelar'
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  function confirmarAcap() {
    if (acao === 'confirmar') {
      confirmarAgendamento()
    } else {
      confirmarCancelamento()
    }
  }

  function confirmarAgendamento() {
    setIsSubmitting(true)
    confirmarAgendamentoAction(id)
      .then((result) => {
        toast({
          variant: result.success ? 'success' : 'destructive',
          title: result.success ? 'Sucesso!' : 'Erro!',
          description: result.message,
        })
        setModalOpen(false)
      })
      .finally(() => setIsSubmitting(false))
  }

  function confirmarCancelamento() {
    setIsSubmitting(true)
    cancelarAgendamentoAction(id)
      .then((result) => {
        toast({
          variant: result.success ? 'success' : 'destructive',
          title: result.success ? 'Sucesso!' : 'Erro!',
          description: result.message,
        })
        setModalOpen(false)
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger>
        {acao === 'confirmar' ? (
          <Badge
            variant="success"
            className="animate-pulse p-[6px] hover:cursor-pointer"
          >
            Confirmar
          </Badge>
        ) : (
          <Badge variant="destructive" className="p-[6px] hover:cursor-pointer">
            Cancelar
          </Badge>
        )}
      </DialogTrigger>
      <DialogContent className="w-[360px] rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle>
            Confirma o {acao === 'confirmar' ? 'agendamento' : 'cancelamento'} ?
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-row items-end justify-center">
          <Button
            type="button"
            onClick={confirmarAcap}
            variant={acao === 'confirmar' ? 'success' : 'destructive'}
            className="flex gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <CheckCircle size={16} />
                <span>SIM!</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
