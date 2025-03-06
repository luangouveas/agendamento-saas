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
      <div className="pt-6">
        <AgendadorHeader />
        <div className="mt-6 w-full border-b border-gray-700"></div>
      </div>

      <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>

      <div>
        <AgendadorFooter slug={authSlug!} />
      </div>
    </div>
  )
}
