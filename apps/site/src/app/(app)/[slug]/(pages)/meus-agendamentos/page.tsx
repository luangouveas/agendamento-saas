import { Suspense } from 'react'

import Loading from '@/components/loading'

import ListaMeusAgendamentosPendentes from './agendamentos-pendentes'
import ListaHistoricoMeusAgendamentos from './historico-agendamentos'

export default function MeusAgendamentosPage() {
  return (
    <div className="space-y-4 px-4">
      <h2>Meus agendamentos</h2>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2>Agendamentos Pendentes</h2>
          <Suspense fallback={<Loading />}>
            <ListaMeusAgendamentosPendentes />
          </Suspense>
        </div>

        <div className="space-y-2">
          <h2>Histórico de Agendamentos</h2>
          <Suspense fallback={<Loading />}>
            <ListaHistoricoMeusAgendamentos />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
