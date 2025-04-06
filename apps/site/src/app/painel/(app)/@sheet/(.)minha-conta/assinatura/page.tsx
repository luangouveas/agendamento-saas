import { InterceptedSheetContent } from '@/components/interceptador-conteudo-sheet'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import AssinaturasPage from '../../../minha-conta/assinatura/page'

export default function MinhaAssinaturaPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Minha Assinatura</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <AssinaturasPage />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
