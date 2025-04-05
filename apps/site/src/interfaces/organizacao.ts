export interface Organizacao {
  id: string
  cnpj: string
  razaoSocial: string
  nome: string
  slug: string
  rua: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  avatarUrl: string | null
}
