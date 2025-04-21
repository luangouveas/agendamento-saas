import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getUserCurrentPlan } from '@/services/stripe'

import ServicoForm from '../servico-form'

export default async function NovoServicoPage() {
  const { quota } = await getUserCurrentPlan()
  const podeCriarServico = quota.servicos.percentUsed < 100

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Novo Serviço</h2>
      <div className="space-y-4">
        {podeCriarServico ? (
          <ServicoForm isUpdating={false} />
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Ação não permitida</AlertTitle>
            <AlertDescription>
              <p>Você chegou ao limite de serviços nesta conta.</p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
