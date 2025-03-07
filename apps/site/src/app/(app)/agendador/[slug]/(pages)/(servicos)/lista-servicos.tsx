import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { buscarServicos } from '@/http/buscar-servicos'

export async function ListaServicos() {
  const organizacaoAtual = await getSlugOrganizacaoAtual()
  const { servicos } = await buscarServicos(organizacaoAtual!)

  return (
    <div className="flex flex-col gap-5">
      {servicos.map((servico) => (
        <Link
          key={servico.id}
          href={`/agendador/${organizacaoAtual}/profissionais?servicoId=${servico.id}`}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex flex-col">
              <span className="text-foreground">{servico.nome}</span>
              <span className="text-xs text-muted-foreground">
                {servico.tempo}min - R$ {servico.valor}
              </span>
            </div>

            <ChevronRight size={24} className="text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  )
}
