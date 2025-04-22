import { Plus } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import ListaExpedientes from './lista-expedientes'

interface ExpedientesMembroPageProps {
  params: {
    membroId: string
  }
}

export default async function ExpedientesMembroPage({
  params,
}: ExpedientesMembroPageProps) {
  const slug = await getSlugOrganizacaoAtual()
  const { membroId } = await params

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Expedientes</h2>
        <Button size="sm" asChild variant="outline">
          <Link
            href={`/painel/${slug!}/profissionais/${membroId}/expedientes/novo`}
          >
            <Plus className="mr-2 size-4" />
            Novo
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <ListaExpedientes membroId={membroId} />
      </div>
    </div>
  )
}
