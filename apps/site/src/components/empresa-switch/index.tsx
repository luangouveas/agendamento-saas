import { ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'

import { Organizacao } from '@/interfaces/organizacao'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type EmpresaSwitcherGenericProps<T = unknown> = {
  children?: React.ReactNode
  className?: string
} & T

type EmpresaSwitcherProps = {
  organizacaoAtual?: Organizacao
}

export function EmpresaSwitcher({
  children,
  organizacaoAtual,
}: EmpresaSwitcherGenericProps<EmpresaSwitcherProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[320px] items-center gap-2 rounded-lg p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {organizacaoAtual ? (
          <>
            <Avatar className="size-8 rounded-lg">
              {organizacaoAtual.avatarUrl && (
                <AvatarImage
                  src={organizacaoAtual.avatarUrl}
                  alt={organizacaoAtual.nome}
                />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">{organizacaoAtual.nome}</span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Selecione o estabelecimento
          </span>
        )}
        <ChevronsUpDown className="ml-auto size-5 text-muted-foreground" />
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}

type EmpresaSwitcherContent = {
  label: string
}

export function EmpresaSwitcherContent({
  children,
  label,
}: EmpresaSwitcherGenericProps<EmpresaSwitcherContent>) {
  return (
    <DropdownMenuContent className="w-[320px]">
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      {children}
    </DropdownMenuContent>
  )
}

type ComutadorEmprsaItemProps = {
  organizacao: Organizacao
  isCurrent: boolean
  url: string
}

export function EmpresaSwitcherItem({
  organizacao,
  isCurrent,
  url,
}: EmpresaSwitcherGenericProps<ComutadorEmprsaItemProps>) {
  return (
    <DropdownMenuItem
      asChild
      className="cursor-pointer hover:text-muted-foreground data-[current=true]:font-semibold"
    >
      <Link data-current={isCurrent} href={url}>
        <Avatar className="mr-2 size-6 rounded-lg">
          {organizacao.avatarUrl && (
            <AvatarImage src={organizacao.avatarUrl} alt={organizacao.nome} />
          )}
          <AvatarFallback />
        </Avatar>
        <span className="line-clamp-1 text-base">{organizacao.nome}</span>
      </Link>
    </DropdownMenuItem>
  )
}

export function EmpresaSwitcherContentFooter({
  children,
}: EmpresaSwitcherGenericProps) {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>{children}</DropdownMenuItem>
    </>
  )
}
