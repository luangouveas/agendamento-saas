import { AlertTriangle } from 'lucide-react'

import Header from '@/app/painel/_components/header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getUserCurrentPlan } from '@/services/stripe'

import { EstabelecimentoForm } from '../estabelecimento-form'

export default async function NovoEstabelecimentoPage() {
  const { quota } = await getUserCurrentPlan()
  const podeCriarEstabelecimento = quota.estabelecimentos.percentUsed < 100

  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Novo estabelecimento</h1>
        {podeCriarEstabelecimento ? (
          <EstabelecimentoForm />
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Ação não permitida</AlertTitle>
            <AlertDescription>
              <p>Você chegou ao limite de estabelecimentos nesta conta.</p>
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
