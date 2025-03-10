import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { ScrollArea } from '@/components/ui/scroll-area'

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
        <ScrollArea className="h-[700px] w-full rounded-md">
          <ListaDeHorariosDisponiveis
            slug={slug!}
            servicoId={servicoId}
            profissionalId={profissionalId}
          />
        </ScrollArea>
      )}
    </div>
  )
}
