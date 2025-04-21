import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { buscarPerfil } from '@/http/buscar-perfil'
import { getPrice, Plan } from '@/services/stripe'
import { config } from '@/services/stripe/config'

import { AssinarFree } from './assinar-free'
import BotaoPagamento from './botao-pagamento'

interface DetalhesPlanoAtualProps {
  plano: Plan
}

export default async function DetalhesPlanoAtual({
  plano,
}: DetalhesPlanoAtualProps) {
  const { quota, name } = plano
  const freeQuota = config.stripe.plans.free.quota
  const { usuario } = await buscarPerfil()
  const planPro = config.stripe.plans.pro
  const proPrice = (await getPrice(planPro.priceId)) || ''

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between border-b border-border">
        <div className="flex flex-col gap-2">
          <CardTitle>Acompanhamento do plano</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>
              Analise aqui o estado da sua assinatura{' '}
              <span className="font-bold uppercase">{name}</span>
            </span>
          </CardDescription>
        </div>
        <div>
          {name.toUpperCase() === 'FREE' ? (
            <BotaoPagamento emailUsuario={usuario.email!}>
              {proPrice?.ativo ? 'Assinar PRO' : 'Assinatura desabilitada'}
            </BotaoPagamento>
          ) : (
            <AssinarFree
              quotaEstabelecimentos={freeQuota.estabelecimentos}
              quotaProfissionais={freeQuota.profissionais}
              quotaServicos={freeQuota.servicos}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {/* ESTABELECIMENTOS */}
          <Card>
            <CardContent>
              <CardHeader className="p-1 font-medium">
                Estabelecimentos
              </CardHeader>
              <header className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {quota.estabelecimentos.current}/
                  {quota.estabelecimentos.available}
                </span>
                <span className="text-sm text-muted-foreground">
                  {quota.estabelecimentos.percentUsed}%
                </span>
              </header>
              <main>
                <Progress value={quota.estabelecimentos.percentUsed} />
              </main>
            </CardContent>
          </Card>

          {/* PROFISSIONAIS */}
          <Card>
            <CardContent>
              <CardHeader className="p-1 font-medium">Profissionais</CardHeader>
              <header className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {quota.profissionais.current}/{quota.profissionais.available}
                </span>
                <span className="text-sm text-muted-foreground">
                  {quota.profissionais.percentUsed}%
                </span>
              </header>
              <main>
                <Progress value={quota.profissionais.percentUsed} />
              </main>
            </CardContent>
          </Card>

          {/* SERVIÇOS */}
          <Card>
            <CardContent>
              <CardHeader className="p-1 font-medium">Serviços</CardHeader>
              <header className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {quota.servicos.current}/{quota.servicos.available}
                </span>
                <span className="text-sm text-muted-foreground">
                  {quota.servicos.percentUsed}%
                </span>
              </header>
              <main>
                <Progress value={quota.servicos.percentUsed} />
              </main>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
