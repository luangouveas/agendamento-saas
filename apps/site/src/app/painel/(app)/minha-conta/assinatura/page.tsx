import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import * as stripeService from '@/services/stripe'

import { criarSessaoDeAssinatura } from './actions'

export default async function AssinaturasPage() {
  const { name, quota } = await stripeService.getUserCurrentPlan()
  /*

- setar variaveis de assinatura nos usuarios DONOS criados (no banco de dados)
- logar com usuario que seja dono de alguma organização
- controlar acesso a pagina para nao der erro se o usuario nao for um assinante 
- controlar todo o modulo para so deixar acessar se na sessao tiver um token admin (dono ou func de alguma org)
  - no login com email e senha, deve validar se o usuario é func de alguma org
    - depois do login
      - o usuario deve selecionar a org na combo se possuir mais de uma
        - se possuir apenas uma org o sistema deve seleciona-la automaticamente
        - setar o slug da org após a seleção (pra poder carregar os dados de serviços e funcionarios)
        - setar token como admin (diferente do token de cliente)


    token admin so da acesso ao painel
    token cliente so da acesso ao agendador

*/
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Uso do plano</CardTitle>
        <CardDescription>Gerencie aqui a sua assinatura.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          Serviços
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
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border pt-2">
        <span>Assine o PRO por R$ 10,99/mês</span>
        <form action={criarSessaoDeAssinatura}>
          <Button type="submit" variant="default">
            Assinar
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
