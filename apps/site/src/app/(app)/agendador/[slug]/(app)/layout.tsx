import { redirect } from 'next/navigation'

import {
  getSlugOrganizacaoAtual,
  usuarioEstaAutenticado,
} from '@/app/auth/auth'
import { AgendadorFooter } from '@/components/agendador-footer'
import { AgendadorHeader } from '@/components/agendador-header'

type Params = Promise<{ slug: string }>

export default async function AppLayout({
  children,
  sheet,
  params,
}: {
  children: React.ReactNode
  sheet: React.ReactNode
  params: Params
}) {
  if (!(await usuarioEstaAutenticado())) {
    return redirect('sign-in')
  }

  const slugAth = await getSlugOrganizacaoAtual()
  const { slug } = await params

  return (
    <div>
      <AgendadorHeader />

      <main className="p-4 pb-20">
        {children}
        {sheet}
      </main>

      <AgendadorFooter slug={slugAth ?? slug} />
    </div>
  )
}
