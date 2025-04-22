import ExpedienteForm from '../expediente-form'

interface NovoExpedientePageProps {
  params: {
    membroId: string
  }
}

export default async function NovoExpedientePage({
  params,
}: NovoExpedientePageProps) {
  const { membroId } = await params
  return <ExpedienteForm isUpdating={false} membroId={membroId} />
}
