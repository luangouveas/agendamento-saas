import ExpedienteForm from '@/app/painel/(app)/[slug]/profissionais/[membroId]/expedientes/expediente-form'
import { getSlugOrganizacaoAtual } from '@/auth/auth'
import InterceptedModalContent from '@/components/interceptador-conteudo-modal'
import { DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BuscarExpediente } from '@/http/buscar-expediente'

interface EditarExpedientePageProps {
  params: {
    slug: string
    membroId: string
    id: string
  }
}

export default async function EditarExpedientePage({
  params,
}: EditarExpedientePageProps) {
  const { id, membroId, slug } = await params
  const { expediente } = await BuscarExpediente({
    slug,
    expedienteId: id,
  })

  return (
    <InterceptedModalContent>
      <DialogTitle>{expediente.nome}</DialogTitle>
      <ScrollArea>
        <ExpedienteForm
          className="max-h-[80dvh] p-4"
          isUpdating={true}
          initialData={{
            id,
            membroId,
            nome: expediente.nome,
            diasExpediente: expediente.diasExpediente,
          }}
        />
      </ScrollArea>
    </InterceptedModalContent>
  )
}
