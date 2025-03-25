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
    <div className="fixed bottom-0 flex h-24 w-full flex-row justify-center p-2">
      <div className="flex h-16 w-full max-w-4xl flex-row items-center justify-between rounded-full border-[3px] bg-background px-3 dark:border-2">
        <div>
          <Button
            asChild
            className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground data-[current=true]:text-muted-foreground"
          >
            <NavLink href={`/${props.slug}/novo-agendamento`}>
              <CalendarDays className="size-6 sm:size-7" />
              <span className="xs:block hidden text-[10px] sm:text-xs">
                Novo agendamento
              </span>
            </NavLink>
          </Button>
        </div>

        <div>
          <Button
            asChild
            className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground data-[current=true]:text-muted-foreground"
          >
            <NavLink href={`/${props.slug}/meus-agendamentos`}>
              <ListChecks className="size-6 sm:size-7" />
              <span className="xs:block hidden text-[10px] sm:text-xs">
                Meus agendamentos
              </span>
            </NavLink>
          </Button>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex h-full w-full flex-col items-center bg-transparent p-4 text-foreground hover:cursor-pointer hover:bg-transparent hover:text-muted-foreground">
                <Grip className="size-6 sm:size-7" />
                <span className="xs:block hidden text-center text-[10px] font-medium sm:text-xs">
                  Outras opções
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                asChild
                className="text-lg hover:cursor-pointer"
              >
                <a href={`/${props.slug}/meu-perfil`}>
                  <User className="mr-2 size-6" /> Meus dados
                </a>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="text-lg hover:cursor-pointer"
              >
                <a href={`/api/sign-out`}>
                  <LogOut className="mr-2 size-6" /> Sair
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
