'use client'

import { CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { cn } from '@/lib/utils'

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

  const [success, setSuccess] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)

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
        if (result.success) {
          setSuccess(true)
          setMessage(null)
          setModalOpen(false)
        } else {
          setSuccess(false)
          setMessage(result.message)
        }
      })
      .finally(() => setIsSubmitting(false))
  }

  function confirmarCancelamento() {
    setIsSubmitting(true)
    cancelarAgendamentoAction(id)
      .then((result) => {
        if (result.success) {
          setSuccess(true)
          setMessage(null)
          setModalOpen(false)
        } else {
          setSuccess(false)
          setMessage(result.message)
        }
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

        {!success && message && (
          <Alert variant="destructive">
            <AlertDescription className="text-center font-semibold">
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex w-full flex-row items-end justify-center">
          <Button
            type="button"
            onClick={confirmarAcap}
            className={cn(
              'flex gap-2',
              acao === 'confirmar'
                ? 'bg-green-600 text-white'
                : 'bg-destructive text-destructive-foreground',
            )}
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
