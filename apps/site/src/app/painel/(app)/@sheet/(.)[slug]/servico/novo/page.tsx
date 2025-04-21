import { AlertTriangle } from 'lucide-react'

import ServicoForm from '@/app/painel/(app)/[slug]/servico/servico-form'
import { InterceptedSheetContent } from '@/components/interceptador-conteudo-sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getUserCurrentPlan } from '@/services/stripe'

export default async function NovoServicoPage() {
  const { quota } = await getUserCurrentPlan()
  const podeCriarServico = quota.servicos.percentUsed < 100

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Novo serviço</SheetTitle>
        </SheetHeader>

        <div className="py-4">
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
      </InterceptedSheetContent>
    </Sheet>
  )
}
