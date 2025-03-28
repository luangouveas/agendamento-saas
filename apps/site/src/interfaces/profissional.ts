export interface IProfissional {
  id: string
  membroId: string
  nome: string
  rua: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  avatarUrl: string | null
  createdAt: Date
  dataNascimento: Date | null
  numeroCelular: string
  email: string | null
}
