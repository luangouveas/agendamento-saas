import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

import ListaDeHorariosDisponiveis from './lista-horarios'

export default async function EscolherDataPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const slug = await getSlugOrganizacaoAtual()
  const { servicoId = '', profissionalId = '' } = await searchParams

  return (
    <div className="space-y-4 px-4">
      <h2 className="text-center font-semibold">Escolha o horário desejado</h2>
      {servicoId && (
        <ListaDeHorariosDisponiveis
          slug={slug!}
          servicoId={servicoId}
          profissionalId={profissionalId}
        />
      )}
    </div>
  )
}
