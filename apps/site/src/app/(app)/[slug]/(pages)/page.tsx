import { redirect } from 'next/navigation'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

export default async function HomePage() {
  const slug = await getSlugOrganizacaoAtual()
  return redirect(`/${slug}/novo-agendamento`)
}
