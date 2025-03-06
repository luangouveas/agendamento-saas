import { redirect } from 'next/navigation'

import { usuarioEstaAutenticado } from '@/app/auth/auth'

export default function AppLayout({
  children,
  sheet,
}: {
  children: React.ReactNode
  sheet: React.ReactNode
}) {
  if (!usuarioEstaAutenticado()) {
    return redirect('sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
