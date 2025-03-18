import { addMinutes, format } from 'date-fns'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { buscarPerfil } from '@/http/buscar-perfil'

import { buscarMeusAgendamentosAction } from './actions'
export default async function ListaHistoricoMeusAgendamentos() {
  const agora = addMinutes(new Date(), -180).toISOString()

  const { usuario } = await buscarPerfil()

  const {
    success,
    message,
    data: todosAgendamentosAteAgora,
  } = await buscarMeusAgendamentosAction({
    clienteId: usuario.id,
    fim: agora,
  })

  return (
    <>
      {!success && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      ) : todosAgendamentosAteAgora!.length > 0 ? (
        todosAgendamentosAteAgora!.map((agH) => (
          <div
            key={agH.id}
            className="flex w-full flex-row gap-2 rounded-md border-2 p-4 shadow-md dark:border-0 dark:bg-zinc-900 dark:text-white"
          >
            <div className="flex w-[20%] flex-col items-center justify-center border-r-2 border-slate-300 p-2 dark:border-muted-foreground">
              <span>{format(new Date(agH.dataHora), 'dd/MM/yyyy')}</span>
              <span>{format(addMinutes(agH.dataHora, 180), 'HH:mm')}</span>
            </div>

            <div className="flex w-[60%] flex-col border-r-2 border-slate-300 p-2 dark:border-muted-foreground">
              <span className="font-medium">{agH.nomeServico}</span>
              <span className="text-sm">R$ {agH.valor}</span>
              <span className="text-sm text-muted-foreground">
                Profissional: {agH.nomeProfissional}
              </span>
            </div>

            <div className="flex w-[20%] items-center justify-center p-2">
              <span>{agH.status}</span>
            </div>
          </div>
        ))
      ) : (
        <Alert variant="alert">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>Não existem agendamentos no seu histórico recente</p>
          </AlertTitle>
        </Alert>
      )}
    </>
  )
}
