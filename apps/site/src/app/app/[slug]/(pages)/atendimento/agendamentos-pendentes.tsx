'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

import DateSelectCalendar from '@/components/date-select-calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { Agendamento } from '@/http/buscar-agendamentos'
import { formatarDataHoraBR } from '@/lib/utils'

import { BuscarAgendamentosAction } from './actions'
import BotaoCancelarAgendamento from './botao-cancelar-agendamento'
import BotaoFinalizarAtendimento from './botao-finalizar-atendimento'
import CarregandoListaSkeleton from './carregando-lista-skeleton'

export default function AgendamentosPendentesPage() {
  const [loading, setLoading] = useState(false)
  const [agendamentos, setAgendamentos] = useState<Agendamento[] | null>(null)
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>()

  const fetchData = async (data?: Date) => {
    setLoading(true)
    setAgendamentos(null)
    setDataSelecionada(data)

    BuscarAgendamentosAction(data)
      .then((result) => {
        if (!result.success) {
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: result.message,
          })
        }
        return result.agendamentos
      })
      .then((agendamentos) => setAgendamentos(agendamentos))
      .finally(() => setLoading(false))
  }

  const onFilter = (data?: Date) => {
    fetchData(data)
  }

  const onSuccess = () => {
    fetchData(dataSelecionada)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg font-semibold">Meus Agendamentos</h2>
        <DateSelectCalendar onFilter={onFilter} className="w-[240px] sm:w-80" />
      </div>

      {loading && <CarregandoListaSkeleton />}

      {!loading && agendamentos?.length === 0 && (
        <Alert variant="alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Nenhum agendamento encontrado.</AlertDescription>
        </Alert>
      )}

      {!loading && agendamentos && agendamentos.length > 0 && (
        <div className="rounded border">
          <Table>
            <TableBody>
              {agendamentos.map((agendamento) => {
                return (
                  <TableRow key={agendamento.id}>
                    <TableCell className="py-2.5" style={{ width: 48 }}>
                      <Avatar>
                        {agendamento.avatarCliente && (
                          <AvatarImage
                            src={agendamento.avatarCliente}
                            width={32}
                            height={32}
                            alt=""
                            className="aspect-square size-full"
                          />
                        )}
                        <AvatarFallback />
                      </Avatar>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-2 font-medium">
                          {agendamento.nomeCliente}
                          <span className="text-xs text-muted-foreground"></span>
                        </span>
                      </div>

                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span>{agendamento.nomeServico}</span>
                        <span>
                          {formatarDataHoraBR(agendamento.dataHora)}
                          {' - '}
                          {agendamento.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        <BotaoFinalizarAtendimento
                          agendamentoId={agendamento.id}
                          onSuccess={onSuccess}
                        />

                        <BotaoCancelarAgendamento
                          agendamentoId={agendamento.id}
                          onSuccess={onSuccess}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
