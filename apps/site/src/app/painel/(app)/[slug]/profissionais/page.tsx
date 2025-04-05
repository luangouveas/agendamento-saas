import { getSlugOrganizacaoAtual } from '@/auth/auth'

export default async function ProfissionaisOrganizacao() {
  const slug = await getSlugOrganizacaoAtual()
  return <h1>Profissionais da organização {slug}</h1>
}
