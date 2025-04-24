'use client'

import { format } from 'date-fns'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import DateSelectCalendar from '@/components/date-select-calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { Agendamento } from '@/http/buscar-agendamentos'

import { BuscarAgendamentosAction } from './actions'
import CarregandoListaSkeleton from './carregando-lista-skeleton'

export default function AgendamentosPendentesPage() {
  const [loading, setLoading] = useState(false)
  const [agendamentos, setAgendamentos] = useState<Agendamento[] | null>(null)

  const fetchData = async (data?: Date) => {
    setLoading(true)
    setAgendamentos(null)

    const { success, message, agendamentos } =
      await BuscarAgendamentosAction(data)

    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: message,
      })
    } else {
      setAgendamentos(agendamentos)
    }

    setLoading(false)
  }

  const onFilter = (data?: Date) => {
    fetchData(data)
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
                          {format(agendamento.dataHora, 'dd/MM/yyyy HH:mm')}
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
                        <Button className="text-xs" size="sm" variant="success">
                          <CheckCircle className="size-4 sm:mr-2" />
                          <span className="hidden sm:block">Finalizar</span>
                        </Button>
                        <Button
                          className="text-xs"
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="size-4 sm:mr-2" />
                          <span className="hidden sm:block">Cancelar</span>
                        </Button>
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
