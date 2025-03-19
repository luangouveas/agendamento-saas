'use client'

import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  LucideCircleX,
} from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { cancelarAgendamentoAction } from './actions'

export default function FormCancelarAgendamento({ id }: { id: string }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [success, setSuccess] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)

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
    <div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger>
          <LucideCircleX className="text-red-500 hover:text-red-300" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left">
              Deseja cancelar o agendamento ?
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {!success && message ? (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle className="">
                <p>{message}</p>
              </AlertTitle>
            </Alert>
          ) : (
            ''
          )}

          <div className="flex w-full flex-row items-end justify-end">
            <Button type="button" onClick={confirmarCancelamento}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} /> Confirmar !
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
