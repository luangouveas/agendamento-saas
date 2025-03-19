import { AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { consultarListaDeServicosDaOrganizacao } from './actions'

export async function ListaServicos() {
  const organizacaoAtual = await getSlugOrganizacaoAtual()
  const { data: servicos, message } =
    await consultarListaDeServicosDaOrganizacao(organizacaoAtual!)

  return (
    <div className="flex flex-col gap-5">
      {servicos ? (
        servicos.map((servico) => (
          <Link
            key={servico.id}
            href={`/${organizacaoAtual}/novo-agendamento/profissionais?servicoId=${servico.id}`}
            className="hover:text-muted-foreground"
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
