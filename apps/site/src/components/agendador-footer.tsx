'use client'

import { CalendarDays, Grip, ListChecks, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { NavLink } from './nav-link'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

interface AgendadorFooterProps {
  slug: string
}

export function AgendadorFooter(props: AgendadorFooterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  return (
    <footer className="fixed bottom-0 flex h-16 w-full flex-row items-center justify-between border-t border-gray-700 bg-background p-4">
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex h-full flex-col bg-transparent text-foreground hover:bg-transparent hover:text-muted-foreground">
              <Grip />
              <span className="text-[10px]">Outras opções</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <ul className="space-y-4">
                <li>
                  <Button
                    asChild
                    variant="ghost"
                    className="bg-transparent pl-0 text-foreground hover:bg-transparent hover:text-muted-foreground data-[current=true]:text-muted-foreground"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <NavLink href={`/${props.slug}/meu-perfil`}>
                      <User className="mr-2 size-7" /> Meus dados
                    </NavLink>
                  </Button>
                </li>
                <li className="text-foreground hover:text-muted-foreground">
                  <Link
                    href={`/api/sign-out`}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="mr-2 size-6" /> Sair
                  </Link>
                </li>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </footer>
  )
}
