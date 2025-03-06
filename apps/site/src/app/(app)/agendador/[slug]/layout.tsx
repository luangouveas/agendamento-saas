import { redirect } from 'next/navigation'

import { usuarioEstaAutenticado } from '@/app/auth/auth'

type Params = Promise<{ slug: string }>

export default async function AppLayout({
  children,
  sheet,
}: {
  children: React.ReactNode
  sheet: React.ReactNode
  params: Params
}) {
  if (!(await usuarioEstaAutenticado())) {
    return redirect('sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
