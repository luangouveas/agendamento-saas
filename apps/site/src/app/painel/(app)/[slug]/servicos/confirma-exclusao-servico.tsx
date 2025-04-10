'use client'

import { Loader2, LucideTrash2 } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

import { InativarServicoAction } from './actions'

interface ConfirmaExclusaoServicoProps {
  id: string
}

export function ConfirmaExclusaoServico({ id }: ConfirmaExclusaoServicoProps) {
  const [isPending, setIsPending] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function handleInativarServico() {
    setIsPending(true)
    InativarServicoAction(id)
      .then((ret) => {
        toast({
          variant: `${ret.success ? 'success' : 'destructive'}`,
          description: ret.message,
        })
      })
      .catch((e) => console.log(e.message))
      .finally(() => {
        setIsPending(false)
        setIsOpen(false)
      })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <LucideTrash2 className="mr-2 size-4" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir o serviço?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={handleInativarServico} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
