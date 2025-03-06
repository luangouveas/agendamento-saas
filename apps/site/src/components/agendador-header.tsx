import { Slash } from 'lucide-react'
import Image from 'next/image'

import appIcon from '@/assets/app-icon.svg'

import ComutadorEmpresa from './comutador-empresa'

export async function AgendadorHeader() {
  return (
    <div className="mx-auto flex items-center justify-between border-b border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <Image
          src={appIcon}
          className="size-6 dark:invert"
          alt="Logo do portal agendador"
        />

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <ComutadorEmpresa />
      </div>

      <div className="hidden items-center lg:flex">
        <img src="/logo.png" alt="Logo" className="mr-2 h-8 w-8" />
        <span className="text-lg font-bold">Nome do Sistema</span>
      </div>
    </div>
  )
}
