import { addMinutes, format } from 'date-fns'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { buscarPerfil } from '@/http/buscar-perfil'

import { buscarMeusAgendamentosAction } from './actions'
export default async function ListaMeusAgendamentosPendentes() {
  const agora = addMinutes(new Date(), -180).toISOString()

  const { usuario } = await buscarPerfil()

  const {
    success,
    message,
    data: agendamentosPendentes,
  } = await buscarMeusAgendamentosAction({
    clienteId: usuario.id,
    status: 'PENDENTE',
    inicio: agora,
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
      ) : agendamentosPendentes!.length > 0 ? (
        agendamentosPendentes!.map((agP) => (
          <div
            key={agP.id}
            className="flex w-full flex-row gap-2 rounded-md border-2 p-4 shadow-md dark:border-0 dark:bg-zinc-900 dark:text-white"
          >
            <div className="flex w-[20%] flex-col items-center justify-center border-r-2 border-slate-300 p-2 dark:border-muted-foreground">
              <span>{format(new Date(agP.dataHora), 'dd/MM/yyyy')}</span>
              <span>{format(addMinutes(agP.dataHora, 180), 'HH:mm')}</span>
            </div>

            <div className="flex w-[60%] flex-col border-r-2 border-slate-300 p-2 dark:border-muted-foreground">
              <span className="font-medium">{agP.nomeServico}</span>
              <span className="text-sm">R$ {agP.valor}</span>
              <span className="text-sm text-muted-foreground">
                Profissional: {agP.nomeProfissional}
              </span>
            </div>

            <div className="flex w-[20%] items-center justify-center p-2">
              <span>{agP.status}</span>
            </div>
          </div>
        ))
      ) : (
        <Alert variant="alert">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>Não existem agendamentos pendentes.</p>
          </AlertTitle>
        </Alert>
      )}
    </>
  )
}
