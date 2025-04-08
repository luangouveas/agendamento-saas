import { api } from './api-client'

interface CriarServicoRequest {
  nome: string
  descricao: string
  tempo: number
  valor: number
}

interface CriarServicoResponse {
  servicoId: string
}

export async function CriarServico(servico: CriarServicoRequest, slug: string) {
  console.log(servico)

  const result = await api
    .post(`organizacao/${slug}/servico`, {
      json: {
        nome: servico.nome,
        descricao: servico.descricao,
        valor: servico.valor,
        tempo: servico.tempo,
      },
    })
    .json<CriarServicoResponse>()

  console.log(result)

  return result
}
