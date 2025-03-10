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
    <div>
      {diasDisponiveis ? (
        <div>
          <h1>Escolha o dia desejado</h1>

          {diasDisponiveis.map((d) => (
            <div className="g-2 mt-6 flex flex-col border-b">
              <span>
                {d.data} - {d.diaSemana}
              </span>
              <div className="mt-2">
                {d.horarios.map((h) => (
                  <span className="flex gap-2">{h}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
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
