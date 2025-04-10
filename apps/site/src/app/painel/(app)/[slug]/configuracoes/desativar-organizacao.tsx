'use client'

import { Loader2, XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

import { DesativarOrganizacaoAction } from './actions'

interface DesativarOrganizacaoBotaoProps {
  slug: string
}

export function DesativarOrganizacaoBotao({
  slug,
}: DesativarOrganizacaoBotaoProps) {
  async function desativarOrganizacao() {
    setIsPending(true)

    DesativarOrganizacaoAction(slug!)
      .then((ret) => {
        if (!ret.success) {
          toast({
            variant: 'destructive',
            description: ret.message,
          })
        } else {
          toast({
            variant: 'success',
            description: ret.message,
          })
          redirect('/painel')
        }
      })
      .finally(() => setIsPending(false))
  }

  const [isPending, setIsPending] = useState(false)

  return (
    <Button
      onClick={desativarOrganizacao}
      variant="destructive"
      className="w-56"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Excluindo...
        </>
      ) : (
        <>
          <XCircle className="mr-2 size-4" />
          Excluir estabelecimento
        </>
      )}
    </Button>
  )
}
