import { addMinutes, format } from 'date-fns'
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

import AcaoAgendamentoForm from './acao-agendamento-form'
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
          <Card
            key={agP.id}
            className="border-zinc-300 shadow-lg shadow-zinc-400 dark:border-zinc-800 dark:shadow-sm dark:shadow-slate-200"
          >
            <CardHeader className="px-6 pb-3 pt-4">
              <div className="flex flex-row justify-between border-b-2 pb-3">
                <div>
                  <CardTitle className="text-xl">
                    {format(new Date(agP.dataHora), 'dd/MM/yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {format(addMinutes(agP.dataHora, 180), 'HH:mm')}
                  </CardDescription>
                </div>
                <div className="flex flex-row items-start justify-start gap-1">
                  <AcaoAgendamentoForm id={agP.id} acao="confirmar" />
                  <AcaoAgendamentoForm id={agP.id} acao="cancelar" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex w-full flex-col gap-3">
                <div className="grid w-full">
                  <span className="text-lg font-medium">{agP.nomeServico}</span>
                  <span className="text-sm">
                    {agP.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Profissional: {agP.nomeProfissional}
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
            <p>Não existem agendamentos pendentes.</p>
          </AlertTitle>
        </Alert>
      )}
    </>
  )
}
