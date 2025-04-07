import { Convites } from './convites'
import ListaProfissionais from './lista-profissionais'

export default function ProfissionaisOrganizacao() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Profissionais</h2>

      <div className="space-y-4">
        <Convites />
        <ListaProfissionais />
      </div>
    </div>
  )
}
