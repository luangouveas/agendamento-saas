'use server'

import { z } from 'zod'

const organizacaoSchema = z.object({
  cnpj: z.string(),
  razaoSocial: z.string(),
  nome: z.string(),
  rua: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
  cep: z.string(),
})

export type OrganizacaoType = z.infer<typeof organizacaoSchema>

export async function criarOrganizacao() {
  return {
    success: true,
    message: null,
    errors: null,
  }
}

export async function atualizarOrganizacao() {
  return {
    success: true,
    message: null,
    errors: null,
  }
}
