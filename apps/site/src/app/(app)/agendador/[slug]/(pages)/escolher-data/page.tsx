import { HTTPError } from 'ky'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { buscarHorariosDisponiveis } from '@/http/buscar-horarios-disponiveis'

export default async function EscolherDataPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const slug = await getSlugOrganizacaoAtual()
  const { servicoId = '', profissionalId = '' } = await searchParams

  try {
    const { diasDisponiveis } = await buscarHorariosDisponiveis(
      slug!,
      servicoId,
      profissionalId,
    )

    return (
      diasDisponiveis && (
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
      )
    )
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return <h2>{message}</h2>
    }

    return <h2>{err.message}</h2>
  }
}
