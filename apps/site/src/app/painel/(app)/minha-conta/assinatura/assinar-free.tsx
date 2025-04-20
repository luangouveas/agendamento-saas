'use client'

import { Loader2, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'

import { atualizarAssinaturaFREEAction } from './actions'

interface AssinarFreeProps {
  quotaEstabelecimentos: number
  quotaProfissionais: number
  quotaServicos: number
}

export function AssinarFree({
  quotaEstabelecimentos,
  quotaProfissionais,
  quotaServicos,
}: AssinarFreeProps) {
  const [, handleSubmit, isPending] = useFormState(
    atualizarAssinaturaFREEAction,
    (message) => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: message,
      })
    },
    (message) => {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: message,
      })
    },
  )

  return (
    // <div className="mt-2 w-full flex-col gap-3">
    //   <div className="flex items-center justify-between">
    //     <div className="text-sm">
    //       Retorne à assinatura FREE
    //       <div className="flex flex-col items-start gap-1 text-sm italic text-muted-foreground">
    //         <span>{quotaEstabelecimentos} Estabelecimentos</span>
    //         <span>{quotaProfissionais} Profissionais</span>
    //         <span>{quotaServicos} Serviços</span>
    //       </div>
    //     </div>

    <form onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive" disabled={isPending}>
        {isPending ? (
          <div className="flex gap-1">
            <Loader2 className="size-4 animate-spin" />
            Processando...
          </div>
        ) : (
          <>
            <XCircle className="mr-2 size-5" />
            Cancelar assinatura PRO
          </>
        )}
      </Button>
    </form>
    //   </div>
    // </div>
  )
}
