import { AlertTriangle } from 'lucide-react'

import { InterceptedSheetContent } from '@/components/interceptador-conteudo-sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getUserCurrentPlan } from '@/services/stripe'

import { EstabelecimentoForm } from '../../estabelecimento-form'

export default async function NovoEstabelecimentoPage() {
  const { quota } = await getUserCurrentPlan()
  const podeCriarEstabelecimento = quota.estabelecimentos.percentUsed < 100

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Novo estabelecimento</SheetTitle>
        </SheetHeader>

        <div className="py-4">
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
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
