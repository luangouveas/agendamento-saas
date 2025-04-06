import { Button } from '@/components/ui/button'
import { config } from '@/config'

import { criarSessaoDeAssinatura } from './actions'

export function AssinarFree() {
  const {
    estabelecimentos: quotaEstabelecimentos,
    profissionais: quotaProfissionais,
    servicos: quotaServicos,
  } = config.stripe.plans.free.quota
  return (
    <div className="w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-sm">Retorne à assinatura free</p>

        <form action={criarSessaoDeAssinatura}>
          <Button type="submit" variant="destructive">
            Voltar ao FREE
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
