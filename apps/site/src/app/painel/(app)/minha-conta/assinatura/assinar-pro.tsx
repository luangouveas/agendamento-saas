import { Button } from '@/components/ui/button'
import { config } from '@/config'
import { getPrice } from '@/services/stripe'

import { criarSessaoDeAssinatura } from './actions'

export async function AssinarPro() {
  const planPro = config.stripe.plans.pro
  const {
    estabelecimentos: quotaEstabelecimentos,
    profissionais: quotaProfissionais,
    servicos: quotaServicos,
  } = planPro.quota
  const proPrice = await getPrice(planPro.priceId)

  return (
    <div className="w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-sm">
          {`Ative a assinatura PRO por R$ ${proPrice.valor || 'Preço'} /mês`}
        </p>

        <form action={criarSessaoDeAssinatura}>
          <Button type="submit" disabled={!proPrice?.ativo} variant="default">
            {proPrice?.ativo ? 'Assinar PRO' : 'Assinatura desabilitada'}
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
