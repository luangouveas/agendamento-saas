import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

import DadosServico from './dados-servico'
import ListaDeHorariosDisponiveis from './lista-horarios'

export default async function EscolherHorarioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { servicoId = '', profissionalId = '' } = await searchParams
  const slug = await getSlugOrganizacaoAtual()

  return (
    <div className="space-y-4 px-4">
      <div className="flex w-full justify-center">
        <h2 className="text-center font-semibold">
          Escolha o horário desejado
        </h2>
      </div>
      {servicoId && (
        <div>
          <DadosServico
            servicoId={servicoId}
            profissionalId={profissionalId}
            slug={slug!}
          />

          <ListaDeHorariosDisponiveis
            servicoId={servicoId}
            profissionalId={profissionalId}
            slug={slug!}
          />
        </div>
      )}
    </div>
  )
}
