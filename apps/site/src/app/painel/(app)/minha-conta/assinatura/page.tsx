import { getUserCurrentPlan } from '@/services/stripe'

import DetalhesAssinatura from './detalhes-assinatura'
import DetalhesPlanoAtual from './detalhes-plano-atual'

export default async function AssinaturasPage() {
  const plano = await getUserCurrentPlan()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Minha assinatura</h2>

      <div className="flex flex-row gap-2">
        <div className="w-full">
          <DetalhesPlanoAtual plano={plano} />
        </div>
        {plano.stripeSubscriptionId && (
          <div className="w-[580px]">
            <DetalhesAssinatura customerId={plano.stripeCustomerId!} />
          </div>
        )}
      </div>
    </div>
  )
}
