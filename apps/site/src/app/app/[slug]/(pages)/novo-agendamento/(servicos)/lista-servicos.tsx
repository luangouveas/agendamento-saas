import { AlertTriangle } from 'lucide-react'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Alert, AlertTitle } from '@/components/ui/alert'

import { consultarListaDeServicosDaOrganizacao } from './actions'
import ServicoComponent from './servico-component'

export async function ListaServicos() {
  const slug = await getSlugOrganizacaoAtual()
  const { data: servicos, message } =
    await consultarListaDeServicosDaOrganizacao(slug!)

  return (
    <div className="flex flex-col gap-5">
      {servicos ? (
        servicos.map((servico) => (
          <ServicoComponent key={servico.id} servico={servico} slug={slug!} />
        ))
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}
