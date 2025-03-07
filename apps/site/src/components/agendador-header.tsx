import { Slash } from 'lucide-react'
import Image from 'next/image'

import appIcon from '@/assets/app-icon.svg'

import ComutadorEmpresa from './comutador-empresa'
import { ComutadorTema } from './theme/comutador-tema'

export async function AgendadorHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={appIcon}
          className="size-6 dark:invert"
          alt="Logo do portal agendador"
        />

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <ComutadorEmpresa />
      </div>

      <div className="flex items-center gap-4">
        <ComutadorTema />
      </div>
    </div>
  )
}
