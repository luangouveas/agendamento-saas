import { getSlugOrganizacaoAtual } from '@/auth/auth'

export default async function DashboardOrganizacao() {
  const slug = await getSlugOrganizacaoAtual()
  return <h1>Dashboard da organização {slug}</h1>
}
