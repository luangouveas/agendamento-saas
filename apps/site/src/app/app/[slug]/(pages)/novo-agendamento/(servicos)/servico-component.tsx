'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AgendamentoContext } from '@/context/agendamento-context'
import { IServico } from '@/interfaces/servico'

interface ServicoComponentProps {
  servico: IServico
  slug: string
}

export default function ServicoComponent({
  servico,
  slug,
}: ServicoComponentProps) {
  const router = useRouter()
  const { escolherServico } = useContext(AgendamentoContext)

  function onClickServico(servico: IServico) {
    escolherServico(servico)
    router.push(`/app/${slug}/novo-agendamento/escolher-profissional`)
  }

  return (
    <div
      className="hover:cursor-pointer hover:text-muted-foreground"
      onClick={() => onClickServico(servico)}
    >
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="size-12">
            {servico.avatarUrl && <AvatarImage src={servico.avatarUrl} />}
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-col">
            <span>{servico.nome}</span>
            <span className="text-xs">
              {servico.tempo} min - R$ {servico.valor}
            </span>
          </div>
        </div>

        <ChevronRight size={24} />
      </div>
    </div>
  )
}
