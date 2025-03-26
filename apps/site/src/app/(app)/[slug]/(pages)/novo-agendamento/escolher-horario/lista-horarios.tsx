'use client'

import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import Loading from '@/components/loading'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { DiasDisponiveisProfissional } from '@/http/buscar-horarios-disponiveis'

import { buscarListaDeHorariosDisponiveis } from './actions'
import DateSelectCalendar from './date-select-calendar'

interface ListaDeHorariosDisponiveisProps {
  servicoId: string
  profissionalId: string
  slug: string
}

export default function ListaDeHorariosDisponiveis({
  servicoId,
  profissionalId,
  slug,
}: ListaDeHorariosDisponiveisProps) {
  const [diasDisponiveis, setDiasDisponiveis] = useState<
    DiasDisponiveisProfissional | []
  >([])
  const [success, setSuccess] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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
      slug!,
      servicoId,
      profissionalId,
      diaSugerido,
    )

    if (success) {
      console.log(diasDisponiveis)
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
  }, [servicoId, profissionalId])

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div className="flex w-full justify-center">
        <DateSelectCalendar onFilter={onFilter} />
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
                      <Link
                        key={dia.data + hora}
                        href={`/${slug}/novo-agendamento/finalizar-agendamento?servicoId=${servicoId}&profissionalId=${profissionalId}&data=${dia.data}&hora=${hora}`}
                        className="flex w-full items-center justify-center"
                      >
                        <span className="rounded-lg bg-zinc-100 p-2 hover:text-muted-foreground dark:bg-zinc-800">
                          {hora}
                        </span>
                      </Link>
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
