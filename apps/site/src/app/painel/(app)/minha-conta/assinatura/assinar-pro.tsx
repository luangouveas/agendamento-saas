import { BuscarAssinaturaUsuarioPorIdUsuario } from '@/http/assinatura'
import { formatarValorParaMoeda } from '@/lib/utils'
import { getPrice } from '@/services/stripe'
import { config } from '@/services/stripe/config'

import BotaoPagamento from './botao-pagamento'

export async function AssinarPro() {
  const { assinatura } = await BuscarAssinaturaUsuarioPorIdUsuario()
  const planPro = config.stripe.plans.pro
  const {
    estabelecimentos: quotaEstabelecimentos,
    profissionais: quotaProfissionais,
    servicos: quotaServicos,
  } = planPro.quota
  const proPrice = (await getPrice(planPro.priceId)) || ''

  return (
    <div className="mt-2 w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {`Assine a versão PRO por R$ ${formatarValorParaMoeda(proPrice.valor)} /mês e obtenha direito a:`}
          <div className="flex flex-col items-start gap-1 text-sm italic text-muted-foreground">
            <span>{quotaEstabelecimentos} Estabelecimentos</span>
            <span>{quotaProfissionais} Profissionais</span>
            <span>{quotaServicos} Serviços</span>
          </div>
        </div>
        <BotaoPagamento emailUsuario={assinatura.email}>
          {proPrice?.ativo ? 'Assinar PRO' : 'Assinatura desabilitada'}
        </BotaoPagamento>
      </div>
    </div>
  )
}
