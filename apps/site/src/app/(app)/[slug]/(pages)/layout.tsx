import { redirect } from 'next/navigation'

import {
  getSlugOrganizacaoAtual,
  usuarioEstaAutenticado,
} from '@/app/auth/auth'
import { Header } from '@/components/header'
import { MenuFlutuante } from '@/components/menu-flutuante'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const slug = await getSlugOrganizacaoAtual()
  if (!(await usuarioEstaAutenticado())) {
    return redirect(`/agendador/${slug}/sign-in`)
  }

  return (
    <div className="space-y-14">
      <Header />
      <main className="w-full pb-28 pt-6">{children}</main>
      <MenuFlutuante slug={slug!} />
    </div>
  )
}
