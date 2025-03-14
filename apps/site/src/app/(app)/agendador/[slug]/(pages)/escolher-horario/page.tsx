import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

import ListaDeHorariosDisponiveis from './lista-horarios'

export default async function EscolherHorarioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const slug = await getSlugOrganizacaoAtual()
  const { servicoId = '', profissionalId = '' } = await searchParams

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-row justify-between">
        <Link href={`/agendador/${slug}/profissionais?servicoId=${servicoId}`}>
          <ChevronLeft size={24} className="text-muted-foreground" />
        </Link>
        <h2 className="text-center font-semibold">
          Escolha o horário desejado
        </h2>
        <div className="min-w-6" />
      </div>
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
