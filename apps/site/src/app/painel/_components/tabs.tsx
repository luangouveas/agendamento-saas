import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { NavLink } from '@/components/nav-link'
import { Button } from '@/components/ui/button'

export async function Tabs() {
  const slug = await getSlugOrganizacaoAtual()

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/painel/${slug}/servicos`}>Serviços</NavLink>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/painel/${slug}/profissionais`}>
            Profissionais
          </NavLink>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/painel/${slug}/configuracoes`}>
            Configuracoes
          </NavLink>
        </Button>
      </nav>
    </div>
  )
}
