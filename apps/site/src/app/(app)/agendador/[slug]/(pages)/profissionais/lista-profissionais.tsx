import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buscarProfissionais } from '@/http/buscar-profissionais'

interface ListaProfissionaisProps {
  servicoId: string
}

export default async function ListaProfissionais(
  props: ListaProfissionaisProps,
) {
  const slug = await getSlugOrganizacaoAtual()
  const { profissionais } = await buscarProfissionais(slug!)

  return (
    <div className="flex flex-col gap-5">
      {profissionais.map((profissional) => (
        <Link
          key={profissional.id}
          href={`/agendador/${slug}/escolher-data?servicoId=${props.servicoId}&profissionalId=${profissional.membroId}`}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex flex-row items-center">
              <div>
                <Avatar className="mr-2 size-8">
                  {profissional.avatarUrl && (
                    <AvatarImage
                      src={profissional.avatarUrl}
                      alt={profissional.nome}
                    />
                  )}
                  <AvatarFallback />
                </Avatar>
              </div>
              <span className="text-foreground">{profissional.nome}</span>
            </div>
            <ChevronRight size={24} className="text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  )
}
