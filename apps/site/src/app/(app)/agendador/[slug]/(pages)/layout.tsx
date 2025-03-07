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
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  if (!(await usuarioEstaAutenticado())) {
    const { slug } = await params
    return redirect(`/agendador/${slug}/sign-in`)
  }

  const authSlug = await getSlugOrganizacaoAtual()

  return (
    <div>
      <AgendadorHeader />
      <main className="w-full pb-20 pt-24">{children}</main>
      <AgendadorFooter slug={authSlug!} />
    </div>
  )
}
