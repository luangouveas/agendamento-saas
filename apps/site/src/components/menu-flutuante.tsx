'use server'

import {
  CalendarDays,
  Grip,
  ListChecks,
  LogOut,
  LucideCalendarCheck,
  User,
} from 'lucide-react'
import Link from 'next/link'

import { ability } from '@/auth/auth'

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

export async function MenuFlutuante(props: MenuFlutuanteProps) {
  const { role } = await ability()

  return (
    <div className="fixed bottom-0 flex h-24 w-full flex-row justify-center p-2">
      <div className="flex h-16 w-full max-w-4xl flex-row items-center justify-between rounded-full border-[3px] bg-background px-3 dark:border-2">
        <div>
          <Button
            asChild
            className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground data-[current=true]:text-muted-foreground"
          >
            <NavLink href={`/app/${props.slug}/novo-agendamento`}>
              <CalendarDays className="size-6 sm:size-7" />
              <span className="hidden text-[10px] sm:text-xs xs:block">
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
            <NavLink href={`/app/${props.slug}/meus-agendamentos`}>
              <ListChecks className="size-5 sm:size-7" />
              <span className="hidden text-[10px] sm:text-xs xs:block">
                Meus agendamentos
              </span>
            </NavLink>
          </Button>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex h-full w-full flex-col items-center bg-transparent p-4 text-foreground hover:cursor-pointer hover:bg-transparent hover:text-muted-foreground">
                <Grip className="size-5 sm:size-7" />
                <span className="hidden text-center text-[10px] font-medium sm:text-xs xs:block">
                  Outras opções
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {role === 'ATENDENTE' && (
                <DropdownMenuItem
                  asChild
                  className="text-lg hover:cursor-pointer"
                >
                  <Link href={`/app/${props.slug}/atendimento`}>
                    <LucideCalendarCheck className="mr-2 size-5" />
                    Atendimento
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                asChild
                className="text-lg hover:cursor-pointer"
              >
                <Link href={`/app/${props.slug}/meu-perfil`}>
                  <User className="mr-2 size-5" /> Meus dados
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="text-lg hover:cursor-pointer"
              >
                <Link href={`/app/api/sign-out`}>
                  <LogOut className="mr-2 size-5" /> Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
