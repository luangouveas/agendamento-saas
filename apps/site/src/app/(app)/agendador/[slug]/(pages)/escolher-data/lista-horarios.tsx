import { AlertTriangle } from 'lucide-react'

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
  const { data: diasDisponiveis, message } =
    await buscarListaDeHorariosDisponiveis(slug, servicoId, profissionalId)

  return (
    <div className="flex flex-col gap-5">
      {diasDisponiveis ? (
        diasDisponiveis.map((d) => (
          <div
            id={d.data}
            className="g-2 mt-6 flex flex-col rounded-tl-lg rounded-tr-lg border-2"
          >
            <span className="rounded-tl-lg rounded-tr-lg bg-slate-200 p-2 pl-6 font-medium dark:bg-muted">
              {d.data} - {d.diaSemana}
            </span>
            <div className="mt-2 grid grid-cols-3 items-center justify-center gap-3 p-4">
              {d.horarios.map((h) => (
                <span id={d.data + h} className="flex justify-center">
                  {h}
                </span>
              ))}
            </div>
          </div>
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
