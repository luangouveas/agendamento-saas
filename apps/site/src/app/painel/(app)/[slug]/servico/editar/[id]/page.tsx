import { getSlugOrganizacaoAtual } from '@/auth/auth'
import TrocarAvatar from '@/components/trocar-avatar'
import { buscarServicoPorId } from '@/http/buscar-servico'

import ServicoForm from '../../servico-form'

interface EditarServicoPageProps {
  params: {
    id: string
  }
}

export default async function EditarServicoPage({
  params,
}: EditarServicoPageProps) {
  const slug = await getSlugOrganizacaoAtual()
  const { id } = await params
  const { servico } = await buscarServicoPorId(slug!, id)

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-row items-center gap-8">
        <TrocarAvatar
          tipoRegistro="servicos"
          idRegistro={servico.id}
          avatarUrlAtual={servico.avatarUrl}
          nomeTagRevalidar={`${slug}/servicos`}
          size={16}
        />
        <h2 className="text-2xl font-semibold">{servico.nome}</h2>
      </div>
      <h2 className="text-2xl font-semibold">{servico.nome}</h2>
      <div className="space-y-4">
        <ServicoForm isUpdating={true} initialData={servico} />
      </div>
    </div>
  )
}
