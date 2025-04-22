import { addMinutes, format, startOfDay } from 'date-fns'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buscarPerfil } from '@/http/buscar-perfil'
import { cn } from '@/lib/utils'

import { buscarMeusAgendamentosAction } from './actions'
export default async function ListaHistoricoMeusAgendamentos() {
  const inicio = addMinutes(startOfDay(new Date()), 10 * -1440).toISOString()
  const agora = addMinutes(new Date(), -180).toISOString()

  const { usuario } = await buscarPerfil()

  const {
    success,
    message,
    data: todosAgendamentosAteAgora,
  } = await buscarMeusAgendamentosAction({
    clienteId: usuario.id,
    status: 'NAO_PENDENTE',
    inicio,
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
          <Card
            key={agH.id}
            className="border-zinc-300 shadow-lg shadow-zinc-400 dark:border-zinc-800 dark:shadow-sm dark:shadow-slate-200"
          >
            <CardHeader className="px-6 pb-1 pt-3">
              <div className="flex flex-row justify-between border-b-2 pb-2">
                <div>
                  <CardTitle className="text-md">
                    {format(new Date(agH.dataHora), 'dd/MM/yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {format(addMinutes(agH.dataHora, 180), 'HH:mm')}
                  </CardDescription>
                </div>
                <div className="flex flex-row items-start justify-start gap-1">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      agH.status === 'CONCLUIDO'
                        ? 'text-green-600'
                        : 'text-red-700',
                    )}
                  >
                    {agH.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex w-full flex-col gap-3">
                <div className="grid w-full">
                  <span className="text-md font-medium">{agH.nomeServico}</span>
                  <span className="text-sm">
                    {agH.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Profissional: {agH.nomeProfissional}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
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
