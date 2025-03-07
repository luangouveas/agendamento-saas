import { ChevronRight } from 'lucide-react'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { buscarServicos } from '@/http/buscar-servicos'

export async function ListaServicos() {
  const organizacaoAtual = await getSlugOrganizacaoAtual()
  const { servicos } = await buscarServicos(organizacaoAtual!)

  return (
    <div className="flex flex-col gap-2">
      {servicos.map((servico) => (
        <div
          key={servico.id}
          className="flex items-center justify-between border-b p-2"
        >
          <div className="flex flex-col">
            <span>{servico.nome}</span>
            <span className="text-xs">
              {servico.tempo}min - R$ {servico.valor}
            </span>
          </div>

          <ChevronRight size={24} className="text-muted-foreground" />
        </div>
      ))}
    </div>
  )
}
