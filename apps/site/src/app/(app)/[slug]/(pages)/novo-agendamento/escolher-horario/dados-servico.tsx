import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DadosServicoProps {
  profissionalAvatar?: string | null
  profissionalNome: string
  servicoNome: string
}

export default function DadosServico(props: DadosServicoProps) {
  const { profissionalAvatar, profissionalNome, servicoNome } = props

  return (
    <div className="mt-10 flex flex-row items-center gap-2">
      <Avatar className="size-16">
        {profissionalAvatar && <AvatarImage src={profissionalAvatar} />}
        <AvatarFallback />
      </Avatar>

      <div className="flex flex-col">
        <span className="text-lg font-medium">{servicoNome}</span>
        <span className="text-muted-foreground">{profissionalNome}</span>
      </div>
    </div>
  )
}
