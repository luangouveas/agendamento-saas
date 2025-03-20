import { Slash } from 'lucide-react'
import Image from 'next/image'

import appIcon from '@/assets/app-icon.svg'

import ComutadorEmpresa from './comutador-empresa'
import { ComutadorTema } from './theme/comutador-tema'

export async function Header() {
  return (
    <header className="fixed top-0 z-50 flex w-full flex-col gap-2 rounded-md border-b-2 bg-background">
      <div className="flex h-16 items-center justify-between rounded-xl bg-background p-6">
        <div className="flex items-center gap-3">
          <Image
            src={appIcon}
            className="hidden size-6 dark:invert sm:block"
            alt="Logo do portal agendador"
          />
          <Slash className="hidden size-3 -rotate-[24deg] text-border sm:block" />
          <ComutadorEmpresa />
        </div>

        <div className="flex items-center gap-4">
          <ComutadorTema />
        </div>
      </div>
    </header>
  )
}
