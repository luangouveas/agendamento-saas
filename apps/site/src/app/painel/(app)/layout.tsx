import { redirect } from 'next/navigation'

import { usuarioAdminEstaAutenticado } from '@/auth/auth'

export default async function AppLayout({
  children,
  sheet,
  modal,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
  modal: React.ReactNode
}>) {
  if (!(await usuarioAdminEstaAutenticado())) {
    return redirect('/painel/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
      {modal}
    </>
  )
}
