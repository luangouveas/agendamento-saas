import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import * as stripeService from '@/services/stripe'
import { config } from '@/services/stripe/config'

import { AssinarFree } from './assinar-free'
import { AssinarPro } from './assinar-pro'

export default async function AssinaturasPage() {
  const { name, quota } = await stripeService.getUserCurrentPlan()

  const freeQuota = config.stripe.plans.free.quota

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Minha assinatura</h2>

      <div className="space-y-4">
        <Card>
          <CardHeader className="border-b border-border">
            <CardDescription className="flex items-center justify-between">
              <div>
                Analise aqui o estado da sua assinatura{' '}
                <span className="font-bold uppercase">{name}</span>
              </div>
            </CardDescription>
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
                      {quota.estabelecimentos.usageEstabelecimentos}%
                    </span>
                  </header>
                  <main>
                    <Progress
                      value={quota.estabelecimentos.usageEstabelecimentos}
                    />
                  </main>
                </CardContent>
              </Card>

              {/* PROFISSIONAIS */}
              <Card>
                <CardContent>
                  <CardHeader className="p-1 font-medium">
                    Profissionais
                  </CardHeader>
                  <header className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {quota.profissionais.current}/
                      {quota.profissionais.available}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {quota.profissionais.usageProfissionais}%
                    </span>
                  </header>
                  <main>
                    <Progress value={quota.profissionais.usageProfissionais} />
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
                      {quota.servicos.usageServicos}%
                    </span>
                  </header>
                  <main>
                    <Progress value={quota.servicos.usageServicos} />
                  </main>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-2">
            {name.toUpperCase() === 'FREE' ? (
              <AssinarPro />
            ) : (
              <AssinarFree
                quotaEstabelecimentos={freeQuota.estabelecimentos}
                quotaProfissionais={freeQuota.profissionais}
                quotaServicos={freeQuota.servicos}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
