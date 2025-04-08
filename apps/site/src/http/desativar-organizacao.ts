import { api } from './api-client'

export async function desativarOrganizacao(slug: string) {
  await api.delete(`organizacao/${slug}`)
}
