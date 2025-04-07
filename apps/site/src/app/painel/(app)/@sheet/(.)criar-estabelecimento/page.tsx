import { InterceptedSheetContent } from '@/components/interceptador-conteudo-sheet'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { EstabelecimentoForm } from '../../estabelecimento-form'

export default function NovoEstabelecimentoPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Novo estabelecimento</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <EstabelecimentoForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
