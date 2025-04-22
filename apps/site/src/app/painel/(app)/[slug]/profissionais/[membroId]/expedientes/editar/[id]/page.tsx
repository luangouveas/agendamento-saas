import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { BuscarExpediente } from '@/http/buscar-expediente'

import ExpedienteForm from '../../expediente-form'

interface EditarExpedientePageProps {
  params: {
    membroId: string
    id: string
  }
}

export default async function EditarExpedientePage({
  params,
}: EditarExpedientePageProps) {
  const { id, membroId } = await params
  const slug = await getSlugOrganizacaoAtual()
  const { expediente } = await BuscarExpediente({
    slug: slug!,
    expedienteId: id,
  })

  return (
    <ExpedienteForm
      isUpdating={true}
      initialData={{
        id,
        nome: expediente.nome,
        diasExpediente: expediente.diasExpediente,
      }}
      membroId={membroId}
    />
  )
}
