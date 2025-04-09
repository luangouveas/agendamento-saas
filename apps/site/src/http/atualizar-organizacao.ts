import { api } from './api-client'

interface AtualizarOrganizacaoRequest {
  cnpj: string
  razaoSocial: string
  nome: string
  cep: string
  rua: string
  bairro: string
  cidade: string
  estado: string
}

type AtualizarOrganizacaoResponse = void

export async function AtualizarOrganizacao(
  organizacao: AtualizarOrganizacaoRequest,
  slug: string,
): Promise<AtualizarOrganizacaoResponse> {
  await api.put(`organizacao/${slug}`, {
    json: {
      cnpj: organizacao.cnpj,
      razaoSocial: organizacao.razaoSocial,
      nome: organizacao.nome,
      cep: organizacao.cep,
      rua: organizacao.rua,
      bairro: organizacao.bairro,
      cidade: organizacao.cidade,
      estado: organizacao.estado,
    },
  })
}
