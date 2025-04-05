import { getSlugOrganizacaoAtual } from '@/auth/auth'

export default async function ServicosOrganizacao() {
  const slug = await getSlugOrganizacaoAtual()
  return <h1>Serviços da organização {slug}</h1>
}
