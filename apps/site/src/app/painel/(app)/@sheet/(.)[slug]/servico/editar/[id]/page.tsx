import ServicoForm from '@/app/painel/(app)/[slug]/servico/servico-form'
import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/interceptador-conteudo-sheet'
import TrocarAvatar from '@/components/trocar-avatar'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { buscarServicoPorId } from '@/http/buscar-servico'
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
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex w-full flex-row items-center gap-4">
              <TrocarAvatar
                tipoRegistro="servicos"
                idRegistro={servico.id}
                avatarUrlAtual={servico.avatarUrl}
                nomeTagRevalidar={`${slug}/servicos`}
                size={16}
              />
              <h2 className="text-xl">{servico.nome}</h2>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ServicoForm isUpdating={true} initialData={servico} />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
