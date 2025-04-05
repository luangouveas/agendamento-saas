import { redirect } from 'next/navigation'

import { usuarioAdminEstaAutenticado } from '@/auth/auth'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await usuarioAdminEstaAutenticado()) {
    redirect('/painel')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
