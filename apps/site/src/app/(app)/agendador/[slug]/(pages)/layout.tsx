import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { AgendadorFooter } from '@/components/agendador-footer'
import { AgendadorHeader } from '@/components/agendador-header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const slug = await getSlugOrganizacaoAtual()

  return (
    <div>
      <div className="pt-6">
        <AgendadorHeader />
        <div className="mt-6 w-full border-b border-gray-700"></div>
      </div>

      <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>

      <div>
        <AgendadorFooter slug={slug!} />
      </div>
    </div>
  )
}
