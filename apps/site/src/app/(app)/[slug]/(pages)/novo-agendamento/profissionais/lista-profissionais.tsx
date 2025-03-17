import { AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { consultarListaDeProfissionaisDaOrganizacao } from './actions'

interface ListaProfissionaisProps {
  servicoId: string
}

export default async function ListaProfissionais(
  props: ListaProfissionaisProps,
) {
  const slug = await getSlugOrganizacaoAtual()
  const { data: profissionais, message } =
    await consultarListaDeProfissionaisDaOrganizacao(slug!)

  return (
    <div className="flex flex-col gap-5">
      {profissionais ? (
        profissionais.map((profissional) => (
          <Link
            key={profissional.id}
            href={`/${slug}/novo-agendamento/escolher-horario?servicoId=${props.servicoId}&profissionalId=${profissional.membroId}`}
            className="hover:text-muted-foreground"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex flex-row items-center gap-2">
                <Avatar className="size-9">
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
          </Link>
        ))
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}
