import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

import ListaProfissionais from './lista-profissionais'

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { servicoId = '' } = await searchParams
  const slug = await getSlugOrganizacaoAtual()

  return (
    <div className="space-y-4 px-4">
      <div className="mb-10 flex flex-row justify-between">
        <Link href={`/agendador/${slug}`}>
          <ChevronLeft size={24} className="text-muted-foreground" />
        </Link>
        <h2 className="text-center font-semibold">
          Escolha o profissional desejado
        </h2>
        <div className="min-w-6" />
      </div>
      {servicoId && <ListaProfissionais servicoId={servicoId} />}
    </div>
  )
}
