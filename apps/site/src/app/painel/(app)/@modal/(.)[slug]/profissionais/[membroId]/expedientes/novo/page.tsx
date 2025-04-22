import ExpedienteForm from '@/app/painel/(app)/[slug]/profissionais/[membroId]/expedientes/expediente-form'
import InterceptedModalContent from '@/components/interceptador-conteudo-modal'
import { DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NovoExpedientePageProps {
  params: {
    membroId: string
  }
}

export default async function NovoExpedientePage({
  params,
}: NovoExpedientePageProps) {
  const { membroId } = await params
  return (
    <InterceptedModalContent>
      <DialogTitle>Novo Expediente</DialogTitle>
      <ScrollArea>
        <ExpedienteForm
          className="max-h-[80dvh] p-4"
          isUpdating={false}
          membroId={membroId}
        />
      </ScrollArea>
    </InterceptedModalContent>
  )
}
