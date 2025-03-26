import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { buscarDadosDoServico } from '../(servicos)/actions'
import { buscarDadosDoProfissional } from '../profissionais/actions'

interface DadosServicoProps {
  servicoId: string
  profissionalId: string
  slug: string
}

export default async function DadosServico(props: DadosServicoProps) {
  const { servicoId, profissionalId, slug } = props

  const profissional = await buscarDadosDoProfissional(slug!, profissionalId)
  const servico = await buscarDadosDoServico(slug!, servicoId)

  return (
    <div className="mt-10 flex flex-row items-center gap-2">
      <Avatar className="size-16">
        {profissional.avatarUrl && <AvatarImage src={profissional.avatarUrl} />}
        <AvatarFallback />
      </Avatar>

      <div className="flex flex-col">
        <span className="text-lg font-medium">{servico.nome}</span>
        <span className="text-muted-foreground">{profissional.nome}</span>
      </div>
    </div>
  )
}
