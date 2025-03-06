import { Slash } from 'lucide-react'
import Image from 'next/image'

import appIcon from '@/assets/app-icon.svg'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export function AgendadorHeader() {
  return (
    <div className="mx-auto flex items-center justify-between border-b border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <Image
          src={appIcon}
          className="size-6 dark:invert"
          alt="Logo do portal agendador"
        />

        <Slash className="size-3 -rotate-[24deg] text-border" />

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
    </div>
  )
}
