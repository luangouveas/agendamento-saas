'use client'

import { CalendarDays, Grip, ListChecks, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface AgendadorFooterProps {
  slug: string
}

export function AgendadorFooter(props: AgendadorFooterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  return (
    <footer className="fixed bottom-0 flex h-16 w-full flex-row items-center justify-between border-t border-gray-700 bg-background p-4">
      <div className="p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href={`/agendador/${props.slug}`}>
                <CalendarDays size={30} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Novo agendamento</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href={`/agendador/${props.slug}/meus-agendamentos`}>
                <ListChecks size={30} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Meus agendamentos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-2">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <SheetTrigger asChild>
                  <Grip size={30} />
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Outras opções</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SheetContent side="right">
            <div className="p-4">
              <h3 className="mb-2 text-lg font-bold">Mais Opções</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/agendador/api/sign-out`}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="mr-2 size-4" /> Sair
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
