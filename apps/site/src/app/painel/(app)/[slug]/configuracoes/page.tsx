import { getSlugOrganizacaoAtual } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BuscarOrganizacao } from '@/http/buscar-organizacao'

import { EstabelecimentoForm } from '../../estabelecimento-form'
import AvatarOrganizacao from './avatar-organizacao'
import { DesativarOrganizacaoBotao } from './desativar-organizacao'

export default async function DadosOrganizacao() {
  const slug = await getSlugOrganizacaoAtual()
  const { organizacao } = await BuscarOrganizacao(slug!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader className="border-b">
            <div className="flex w-full flex-row items-center gap-8">
              <AvatarOrganizacao organizacao={organizacao} size={20} />
              <CardTitle>{organizacao.nome}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <EstabelecimentoForm
              isUpdating
              initialData={{
                bairro: organizacao.bairro,
                cep: organizacao.cep,
                cidade: organizacao.cidade,
                cnpj: organizacao.cnpj,
                estado: organizacao.estado,
                nome: organizacao.nome,
                razaoSocial: organizacao.razaoSocial,
                rua: organizacao.rua,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Excluir estabelecimento</CardTitle>
            <CardDescription>
              Esta ação irá excluir todos os dados do estabelecimento{' '}
              <span className="font-bold">{organizacao.nome}</span>, incluindo
              serviços e agendamentos. Você não poderá reverter essa ação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DesativarOrganizacaoBotao slug={slug!} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
