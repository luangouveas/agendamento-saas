import ServicoForm from '../servico-form'

export default function NovoServicoPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Novo Serviço</h2>
      <div className="space-y-4">
        <ServicoForm isUpdating={false} />
      </div>
    </div>
  )
}
