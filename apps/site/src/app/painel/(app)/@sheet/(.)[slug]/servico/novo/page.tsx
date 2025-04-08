import ServicoForm from '@/app/painel/(app)/[slug]/servico/servico-form'
import { InterceptedSheetContent } from '@/components/interceptador-conteudo-sheet'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function NovoServicoPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Novo serviço</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ServicoForm isUpdating={false} />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
