import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertTitle } from '@/components/ui/alert'

import { buscarListaDeHorariosDisponiveis } from './actions'

interface ListaDeHorariosDisponiveisProps {
  slug: string
  servicoId: string
  profissionalId: string
}

export default async function ListaDeHorariosDisponiveis({
  slug,
  servicoId,
  profissionalId,
}: ListaDeHorariosDisponiveisProps) {
  const {
    success,
    data: diasDisponiveis,
    message,
  } = await buscarListaDeHorariosDisponiveis(slug, servicoId, profissionalId)

  return (
    <div className="mt-6 flex flex-col gap-5">
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

      {diasDisponiveis ? (
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
            <p>Não existem horários disponpiveis nos próximos dias</p>
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}
