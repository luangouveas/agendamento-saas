import { ComutadorTema } from '@/components/theme/comutador-tema'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className="flex w-full flex-row justify-end border p-2">
        <ComutadorTema />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
