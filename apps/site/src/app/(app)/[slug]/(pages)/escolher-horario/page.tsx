import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { buscarDadosDoServico } from '../(servicos)/actions'
import { buscarDadosDoProfissional } from '../profissionais/actions'
import ListaDeHorariosDisponiveis from './lista-horarios'

export default async function EscolherHorarioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const slug = await getSlugOrganizacaoAtual()
  const { servicoId = '', profissionalId = '' } = await searchParams

  const profissional = await buscarDadosDoProfissional(slug!, profissionalId)
  const servico = await buscarDadosDoServico(slug!, servicoId)

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-row justify-between">
        <Link href={`/${slug}/profissionais?servicoId=${servicoId}`}>
          <ChevronLeft size={24} className="text-muted-foreground" />
        </Link>
        <h2 className="text-center font-semibold">
          Escolha o horário desejado
        </h2>
        <div className="min-w-6" />
      </div>
      {servicoId && (
        <div>
          <div className="mt-10 flex flex-row items-center gap-2">
            <Avatar className="size-10">
              {profissional.avatarUrl && (
                <AvatarImage src={profissional.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>

            <div className="flex flex-col">
              <span className="text-base font-medium">{servico.nome}</span>
              <span className="text-muted-foreground">{profissional.nome}</span>
            </div>
          </div>
          <ListaDeHorariosDisponiveis
            slug={slug!}
            servicoId={servicoId}
            profissionalId={profissionalId}
          />
        </div>
      )}
    </div>
  )
}
