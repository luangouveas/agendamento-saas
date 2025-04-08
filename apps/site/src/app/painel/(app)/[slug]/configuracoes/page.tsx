import { getSlugOrganizacaoAtual } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BuscarOrganizacao } from '@/http/buscar-organizacao'

import { EstabelecimentoForm } from '../../estabelecimento-form'
import { DesativarOrganizacaoBotao } from './desativar-organizacao'

export default async function DadosOrganizacao() {
  const slug = await getSlugOrganizacaoAtual()
  const { organizacao } = await BuscarOrganizacao(slug!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do estabelecimento</CardTitle>
            <CardDescription>
              Atualize as informações do seu estabelecimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
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
            </ScrollArea>
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
            <DesativarOrganizacaoBotao />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
