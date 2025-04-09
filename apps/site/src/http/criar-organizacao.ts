import { api } from './api-client'

interface CriarOrganizacaoRequest {
  cnpj: string
  razaoSocial: string
  nome: string
  cep: string
  rua: string
  bairro: string
  cidade: string
  estado: string
}

interface CriarOrganizacaoResponse {
  organizacaoId: string
}

export async function CriarOrganizacao(organizacao: CriarOrganizacaoRequest) {
  const result = await api
    .post(`organizacao`, {
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
    .json<CriarOrganizacaoResponse>()

  return result
}
