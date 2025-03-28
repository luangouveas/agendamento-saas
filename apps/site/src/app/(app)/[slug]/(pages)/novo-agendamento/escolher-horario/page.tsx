import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

import ListaDeHorariosDisponiveis from './lista-horarios'

export default async function EscolherHorarioPage() {
  const slug = await getSlugOrganizacaoAtual()

  return (
    <div className="space-y-4 px-4">
      <div className="mb-10 flex flex-row justify-between">
        <Link href={`/${slug}/novo-agendamento/escolher-profissional`}>
          <ChevronLeft
            size={24}
            className="text-muted-foreground hover:text-foreground"
          />
        </Link>
        <h2 className="text-center font-semibold">
          Escolha o horário desejado
        </h2>
        <div className="min-w-6" />
      </div>

      <ListaDeHorariosDisponiveis slug={slug!} />
    </div>
  )
}
