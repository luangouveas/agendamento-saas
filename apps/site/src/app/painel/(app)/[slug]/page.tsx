import { redirect } from 'next/navigation'

import { getSlugOrganizacaoAtual } from '@/auth/auth'

export default async function HomePage() {
  const slug = await getSlugOrganizacaoAtual()
  return redirect(`/painel/${slug}/servicos`)
}
