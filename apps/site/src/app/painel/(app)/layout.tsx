import { redirect } from 'next/navigation'

import { usuarioAdminEstaAutenticado } from '@/auth/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await usuarioAdminEstaAutenticado())) {
    return redirect('/painel/auth/sign-in')
  }

  return <>{children}</>
}
