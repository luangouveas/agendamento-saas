import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { desativarOrganizacao } from '@/http/desativar-organizacao'

export function DesativarOrganizacaoBotao() {
  async function desativarOrganizacaoAction() {
    'use server'

    const slug = await getSlugOrganizacaoAtual()

    await desativarOrganizacao(slug!)

    redirect('/painel')
  }

  return (
    <form action={desativarOrganizacaoAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Excluir estabelecimento
      </Button>
    </form>
  )
}
