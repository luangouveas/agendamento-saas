import { redirect } from 'next/navigation'

import { usuarioEstaAutenticado } from '@/app/auth/auth'
import { AgendadorFooter } from '@/components/agendador-footer'
import { AgendadorHeader } from '@/components/agendador-header'

export default async function AppLayout({
  children,
  sheet,
}: {
  children: React.ReactNode
  sheet: React.ReactNode
}) {
  if (!(await usuarioEstaAutenticado())) {
    return redirect('sign-in')
  }

  return (
    <div>
      <AgendadorHeader />

      <main className="p-4 pb-20">
        {children}
        {sheet}
      </main>

      <AgendadorFooter />
    </div>
  )
}
