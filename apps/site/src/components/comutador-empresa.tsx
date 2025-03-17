import { ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { buscarOrganizacoes } from '@/http/buscar-organizacoes'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default async function ComutadorEmpresa() {
  const slug = await getSlugOrganizacaoAtual()
  const { organizacoes } = await buscarOrganizacoes()

  const organizacaoAtual = organizacoes.find((org) => org.slug === slug)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[320px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {organizacaoAtual ? (
          <>
            <Avatar className="size-8">
              {organizacaoAtual.avatarUrl && (
                <AvatarImage
                  src={organizacaoAtual.avatarUrl}
                  alt={organizacaoAtual.nome}
                />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left text-base font-normal">
              {organizacaoAtual.nome}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Selecione o estabelecimento
          </span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px]">
        <DropdownMenuLabel>Estabelecimentos</DropdownMenuLabel>
        {organizacoes.map((org) => {
          return (
            <DropdownMenuItem key={org.id} asChild className="cursor-pointer">
              <Link href={`/${org.slug}/novo-agendamento`}>
                <Avatar className="mr-2 size-5">
                  {org.avatarUrl && (
                    <AvatarImage src={org.avatarUrl} alt={org.nome} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <span className="line-clamp-1">{org.nome}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
