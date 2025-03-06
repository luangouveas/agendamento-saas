'use client'

import { CalendarDays, Grip, ListChecks } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="relative min-h-screen pb-20 pt-16">
      <header className="fixed inset-x-0 top-0 flex items-center justify-between border-b border-gray-700 bg-background p-4">
        <div className="flex-1">
          <Select>
            <SelectTrigger className="w-full lg:w-[280px]">
              <SelectValue placeholder="Nome da empresa..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Empresa 01</SelectItem>
              <SelectItem value="dark">Empresa 02</SelectItem>
              <SelectItem value="system">Empresa 03</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="hidden items-center lg:flex">
          <img src="/logo.png" alt="Logo" className="mr-2 h-8 w-8" />
          <span className="text-lg font-bold">Nome do Sistema</span>
        </div>
      </header>

      <main className="p-4"></main>

      <footer className="fixed bottom-0 flex h-16 w-full flex-row items-center justify-between border-t border-gray-700 bg-background p-4">
        <div className="p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href="/agendamento">
                  <CalendarDays width={32} />
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
                <Link href="/meus-agendamentos" className="">
                  <ListChecks width={32} />
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
                    <Grip width={32} />
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
                    <Link href="/opcao1">Opção 1</Link>
                  </li>
                  <li>
                    <Link href="/opcao2">Opção 2</Link>
                  </li>
                  <li>
                    <Link href="/opcao3">Opção 3</Link>
                  </li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </footer>
    </div>
  )
}
