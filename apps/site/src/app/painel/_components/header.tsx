import { PlusCircle, Slash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import appIcon from '@/assets/app-icon.svg'
import { getSlugOrganizacaoAtual } from '@/auth/auth'
import {
  EmpresaSwitcher,
  EmpresaSwitcherContent,
  EmpresaSwitcherContentFooter,
  EmpresaSwitcherItem,
} from '@/components/empresa-switch'
import {
  HeaderContent,
  HeaderContentLeft,
  HeaderContentRight,
  MainHeader,
} from '@/components/header/index'
import { ProfileButton } from '@/components/profile-button'
import { ComutadorTema } from '@/components/theme/comutador-tema'
import { Separator } from '@/components/ui/separator'
import { buscarMinhasOrganizacoes } from '@/http/buscar-minhas-organizacoes'

export default async function Header() {
  const slug = await getSlugOrganizacaoAtual()
  const { organizacoes } = await buscarMinhasOrganizacoes()
  const organizacaoAtual = organizacoes.find((org) => org.slug === slug)

  return (
    <MainHeader>
      <HeaderContent>
        <HeaderContentLeft>
          <Image
            src={appIcon}
            className="hidden size-6 dark:invert sm:block"
            alt="Logo do portal agendador"
          />
          <Slash className="hidden size-3 -rotate-[24deg] text-border sm:block" />
          <EmpresaSwitcher organizacaoAtual={organizacaoAtual}>
            <EmpresaSwitcherContent label="Meus Estabelecimentos">
              {organizacoes.map((org) => {
                const isCurrent = org.slug === organizacaoAtual?.slug
                return (
                  <EmpresaSwitcherItem
                    key={org.id}
                    isCurrent={isCurrent}
                    organizacao={org}
                    url={`/painel/${org.slug}`}
                  />
                )
              })}
              <EmpresaSwitcherContentFooter>
                <Link href="/painel/criar-estabelecimento">
                  <PlusCircle className="mr-2 size-4" />
                  Novo Estabelecimento
                </Link>
              </EmpresaSwitcherContentFooter>
            </EmpresaSwitcherContent>
          </EmpresaSwitcher>
        </HeaderContentLeft>
        <HeaderContentRight>
          <ComutadorTema />
          <Separator orientation="vertical" className="h-5" />
          <ProfileButton />
        </HeaderContentRight>
      </HeaderContent>
    </MainHeader>
  )
}
