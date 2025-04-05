'use client'

import { AlertTriangle } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

import DateSelectCalendar from '@/components/date-select-calendar'
import Loading from '@/components/loading'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AgendamentoContext } from '@/context/agendamento-context'
import { DiasDisponiveisProfissional } from '@/http/buscar-horarios-disponiveis'

import { buscarListaDeHorariosDisponiveis } from './actions'
import DadosServico from './dados-servico'

interface ListaDeHorariosDisponiveisProps {
  slug: string
}

export default function ListaDeHorariosDisponiveis({
  slug,
}: ListaDeHorariosDisponiveisProps) {
  const [diasDisponiveis, setDiasDisponiveis] = useState<
    DiasDisponiveisProfissional | []
  >([])
  const [success, setSuccess] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()

  const { servico, profissional, escolherHorario } =
    useContext(AgendamentoContext)

  if (!servico || !profissional) {
    redirect(`/app/${slug}/novo-agendamento`)
  }

  const onClickHorario = (data: string, hora: string) => {
    escolherHorario(`${data}-${hora}`)
    router.push(`/app/${slug}/novo-agendamento/finalizar-agendamento`)
  }

  const onFilter = (data?: Date) => {
    fetchData(data?.toISOString())
  }

  const fetchData = async (data?: string) => {
    setLoading(true)
    const diaSugerido = data ? data.split('T')[0] : undefined
    const {
      success,
      data: diasDisponiveis,
      message,
    } = await buscarListaDeHorariosDisponiveis(
      slug,
      servico!.id,
      profissional!.membroId,
      diaSugerido,
    )

    if (success) {
      setSuccess(true)
      setMessage(null)
      setDiasDisponiveis(diasDisponiveis ?? [])
    } else {
      setSuccess(true)
      setMessage(message)
      setDiasDisponiveis([])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [servico!.id, profissional!.id])

  return (
    <div className="mt-6 flex flex-col gap-5">
      <DadosServico
        servicoNome={servico!.nome}
        profissionalAvatar={profissional!.avatarUrl}
        profissionalNome={profissional!.nome}
      />

      <div className="flex w-full justify-center">
        <DateSelectCalendar onFilter={onFilter} className="w-[240px] sm:w-80" />
      </div>

      {!success && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      ) : (
        <></>
      )}

      {!loading ? (
        diasDisponiveis?.length > 0 ? (
          diasDisponiveis.map(
            (dia) =>
              dia.horarios.length > 0 && (
                <div key={dia.data} className="g-2 flex flex-col">
                  <span className="p-2 font-medium capitalize">
                    {dia.data} ({dia.diaSemana})
                  </span>
                  <hr />
                  <div className="mt-4 grid grid-cols-3 gap-y-3">
                    {dia.horarios.map((hora) => (
                      <div
                        key={dia.data + hora}
                        className="flex w-full items-center justify-center"
                        onClick={() => onClickHorario(dia.data, hora)}
                      >
                        <span className="rounded-lg bg-zinc-100 p-2 hover:cursor-pointer hover:text-muted-foreground dark:bg-zinc-800">
                          {hora}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )
        ) : (
          <Alert variant="alert">
            <AlertTriangle className="size-4" />
            <AlertTitle>
              <p>Não existem horários disponpiveis.</p>
            </AlertTitle>
          </Alert>
        )
      ) : (
        <Loading />
      )}
    </div>
  )
}
