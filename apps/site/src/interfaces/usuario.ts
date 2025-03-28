export interface IUsuario {
  id: string
  nome: string | null
  dataNascimento: string | null
  email: string | null
  numeroCelular: string
  avatarUrl: string | null
  cep: string | null
  rua: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
}
