import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { SkeletonTable } from '@/components/skeleton/skeleton-table'
import { Button } from '@/components/ui/button'

import ListaServicos from './lista-servicos'

export default async function ServicosOrganizacao() {
  const slug = await getSlugOrganizacaoAtual()

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Serviços</h2>
        <Button size="sm" asChild variant="outline">
          <Link href={`/painel/${slug}/servico/novo`}>
            <Plus className="mr-2 size-4" />
            Novo
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<SkeletonTable />}>
          <ListaServicos />
        </Suspense>
      </div>
    </div>
  )
}
