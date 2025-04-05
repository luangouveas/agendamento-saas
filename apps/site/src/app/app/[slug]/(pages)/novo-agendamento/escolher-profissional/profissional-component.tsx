'use client'

import { ChevronRight } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useContext } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AgendamentoContext } from '@/context/agendamento-context'
import { IProfissional } from '@/interfaces/profissional'

interface ProfissionalComponentProps {
  profissional: IProfissional
  slug: string
}

export default function ProfissionalComponent({
  profissional,
  slug,
}: ProfissionalComponentProps) {
  const router = useRouter()
  const { escolherProfissional, servico } = useContext(AgendamentoContext)

  if (!servico) {
    redirect(`/app/${slug}/novo-agendamento`)
  }

  function onClickProfissional(profissional: IProfissional) {
    escolherProfissional(profissional)
    router.push(`/app/${slug}/novo-agendamento/escolher-horario`)
  }

  return (
    <div
      className="hover:cursor-pointer hover:text-muted-foreground"
      onClick={() => onClickProfissional(profissional)}
    >
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="size-12">
            {profissional.avatarUrl && (
              <AvatarImage
                src={profissional.avatarUrl}
                alt={profissional.nome}
              />
            )}
            <AvatarFallback />
          </Avatar>
          <span>{profissional.nome}</span>
        </div>
        <ChevronRight size={24} />
      </div>
    </div>
  )
}
