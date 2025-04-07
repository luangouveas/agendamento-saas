'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { config } from '@/config'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'

import { atualizarAssinaturaFREEAction } from './actions'

export function AssinarFree() {
  const {
    estabelecimentos: quotaEstabelecimentos,
    profissionais: quotaProfissionais,
    servicos: quotaServicos,
  } = config.stripe.plans.free.quota

  const route = useRouter()

  const [{ success, message }, handleSubmit, isPending] = useFormState(
    atualizarAssinaturaFREEAction,
    () => {
      route.refresh()
    },
  )

  if (success !== null && message) {
    toast({
      variant: success ? 'success' : 'destructive',
      description: message,
    })
  }

  return (
    <div className="w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-sm">Retorne à assinatura free</p>

        <form onSubmit={handleSubmit}>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? (
              <div className="flex gap-1">
                <Loader2 className="size-4 animate-spin" />
                Processando...
              </div>
            ) : (
              'Voltar ao FREE'
            )}
          </Button>
        </form>
      </div>

      <div className="flex flex-col items-start gap-1 text-sm italic text-muted-foreground">
        <span>{quotaEstabelecimentos} Estabelecimentos</span>
        <span>{quotaProfissionais} Profissionais</span>
        <span>{quotaServicos} Serviços</span>
      </div>
    </div>
  )
}
