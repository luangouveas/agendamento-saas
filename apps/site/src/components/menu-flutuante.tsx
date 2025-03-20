'use client'

import { CalendarDays, Grip, ListChecks, LogOut, User } from 'lucide-react'
import Link from 'next/link'

import { NavLink } from './nav-link'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface MenuFlutuanteProps {
  slug: string
}

export function MenuFlutuante(props: MenuFlutuanteProps) {
  return (
    <div className="fixed bottom-0 flex h-24 w-full flex-row items-start justify-center p-2">
      <div className="flex h-16 flex-row items-center justify-between rounded-full border-4 bg-background">
        <div>
          <Button
            asChild
            className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground data-[current=true]:text-muted-foreground"
          >
            <NavLink href={`/${props.slug}/novo-agendamento`}>
              <CalendarDays />
              <span className="text-[10px]">Novo agendamento</span>
            </NavLink>
          </Button>
        </div>

        <div>
          <Button
            asChild
            className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground data-[current=true]:text-muted-foreground"
          >
            <NavLink href={`/${props.slug}/meus-agendamentos`}>
              <ListChecks />
              <span className="text-[10px]">Meus agendamentos</span>
            </NavLink>
          </Button>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground">
                <Grip />
                <span className="text-[10px]">Outras opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem asChild className="hover:cursor-pointer">
                <NavLink
                  href={`/${props.slug}/meu-perfil`}
                  className="flex items-center gap-2"
                >
                  <User className="mr-2 size-7" /> Meus dados
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="hover:cursor-pointer">
                <Link
                  href={`/api/sign-out`}
                  className="flex items-center gap-2"
                >
                  <LogOut className="mr-2 size-6" /> Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
