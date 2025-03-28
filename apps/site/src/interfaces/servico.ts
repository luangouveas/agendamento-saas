export interface IServico {
  id: string
  nome: string
  organizacaoId: string
  descricao: string
  valor: number
  tempo: number
  avatarUrl?: string | null
}
