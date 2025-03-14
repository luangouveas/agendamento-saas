import { ListaServicos } from './lista-servicos'

export default function ServicosPage() {
  return (
    <div className="space-y-4 px-4">
      <h2 className="mb-10 text-center font-semibold">Escolha um serviço</h2>
      <ListaServicos />
    </div>
  )
}
