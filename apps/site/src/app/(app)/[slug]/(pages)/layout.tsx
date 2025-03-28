import { redirect } from 'next/navigation'

import {
  getSlugOrganizacaoAtual,
  usuarioEstaAutenticado,
} from '@/app/auth/auth'
import { Header } from '@/components/header'
import { MenuFlutuante } from '@/components/menu-flutuante'
import { AgendamentoProvider } from '@/context/agendamento-context'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const slug = await getSlugOrganizacaoAtual()
  if (!(await usuarioEstaAutenticado())) {
    return redirect(`/${slug}/sign-in`)
  }

  return (
    <div className="flex justify-center space-y-14">
      <Header />
      <AgendamentoProvider>
        <main className="w-full max-w-4xl pb-28 pt-6">{children}</main>
      </AgendamentoProvider>
      <MenuFlutuante slug={slug!} />
    </div>
  )
}
