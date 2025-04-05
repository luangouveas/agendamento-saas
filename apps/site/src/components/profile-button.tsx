import { ChevronDown, DollarSign, LogOut, User2 } from 'lucide-react'
import Link from 'next/link'

import { authAdmin } from '@/auth/auth'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return initials
}

export async function ProfileButton() {
  const usuario = await authAdmin()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{usuario.nome}</span>
          <span className="text-xs text-muted-foreground">{usuario.email}</span>
        </div>
        <Avatar className="size-8">
          {usuario.avatarUrl && <AvatarImage src={usuario.avatarUrl} />}
          {usuario.nome && (
            <AvatarFallback>{getInitials(usuario.nome)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/painel/minha-conta/meu-perfil">
            <User2 className="mr-2 size-4" />
            Meu Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/painel/minha-conta/assinatura">
            <DollarSign className="mr-2 size-4" />
            Assinatura
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
