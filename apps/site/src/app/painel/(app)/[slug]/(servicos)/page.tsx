import ListaServicos from './lista-servicos'

export default function ServicosOrganizacao() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Serviços</h2>
      <div className="space-y-4">
        <ListaServicos />
      </div>
    </div>
  )
}
