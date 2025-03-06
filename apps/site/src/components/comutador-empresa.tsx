import { ChevronsUpDown } from 'lucide-react'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { buscarOrganizacoes } from '@/http/buscar-organizacoes'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'

export default async function ComutadorEmpresa() {
  const slug = getSlugOrganizacaoAtual()
  const { organizacoes } = await buscarOrganizacoes()

  const organizacaoAtual = organizacoes.find((org) => org.slug === slug)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[188px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {organizacaoAtual ? (
          <>
            <Avatar className="size-4">
              {organizacaoAtual.avatarUrl && (
                <AvatarImage
                  src={organizacaoAtual.avatarUrl}
                  alt={organizacaoAtual.nome}
                />
              )}
              <AvatarFallback />
            </Avatar>
          </>
        ) : (
          <span className="text-muted-foreground">
            Selecione o estabelecimento
          </span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
