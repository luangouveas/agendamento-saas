import { redirect } from 'next/navigation'

import { Header } from '@/app/app/_components/header'
import { getSlugOrganizacaoAtual, usuarioEstaAutenticado } from '@/auth/auth'
import { MenuFlutuante } from '@/components/menu-flutuante'
import { AgendamentoProvider } from '@/context/agendamento-context'
import { buscarOrganizacoes } from '@/http/buscar-organizacoes'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const slug = await getSlugOrganizacaoAtual()
  if (!(await usuarioEstaAutenticado())) {
    return redirect(`/app/${slug}/sign-in`)
  }

  const { organizacoes } = await buscarOrganizacoes()
  const organizacaoAtual = organizacoes.find((org) => org.slug === slug)

  return (
    <div className="flex justify-center space-y-14">
      <Header organizacaoAtual={organizacaoAtual} organizacoes={organizacoes} />
      <AgendamentoProvider>
        <main className="w-full max-w-4xl pb-28 pt-6">{children}</main>
      </AgendamentoProvider>
      <MenuFlutuante slug={slug!} />
    </div>
  )
}
