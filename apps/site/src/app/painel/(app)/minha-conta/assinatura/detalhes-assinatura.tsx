import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  buscarCartosDeCreditoCliente,
  getSubscriptionByCustomerId,
  translateSubscriptionInterval,
  translateSubscriptionStatus,
} from '@/services/stripe'

interface DetalhesAssinaturaProps {
  customerId: string
}

export default async function DetalhesAssinatura({
  customerId,
}: DetalhesAssinaturaProps) {
  const subscription = await getSubscriptionByCustomerId(customerId)
  const cartoes = await buscarCartosDeCreditoCliente(customerId)
  const cartaoPrincipal = cartoes.data.find(
    (c) => c.id === subscription.default_payment_method,
  )

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Detalhes da assinatura</CardTitle>
        <CardDescription>
          Informações sobre o faturamento da sua assinatura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plano:</span>
            <span>{subscription.plan.nickname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-green-600">
              {translateSubscriptionStatus(subscription.status)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data da Assinatura:</span>
            <span>
              {new Date(subscription.start_date * 1000).toLocaleDateString(
                'pt-BR',
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Forma de Pagamento:</span>
            <div className="flex flex-col">
              <span>Cartão de Crédito</span>
              <span className="text-end text-xs">
                {cartaoPrincipal?.card?.display_brand?.toLocaleUpperCase()} -{' '}
                Final: {cartaoPrincipal?.card?.last4}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Próxima Cobrança:</span>
            <span>
              {new Date(
                subscription.items.data[0].current_period_end * 1000,
              ).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor:</span>
            <span>
              {(subscription.plan.amount! / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ciclo:</span>
            <span>
              {translateSubscriptionInterval(subscription.plan.interval)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
