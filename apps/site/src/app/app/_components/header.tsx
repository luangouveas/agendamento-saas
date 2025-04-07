import { Slash } from 'lucide-react'
import Image from 'next/image'

import appIcon from '@/assets/app-icon.svg'
import {
  EmpresaSwitcher,
  EmpresaSwitcherContent,
  EmpresaSwitcherItem,
} from '@/components/empresa-switch'
import {
  HeaderContent,
  HeaderContentLeft,
  HeaderContentRight,
  MainHeader,
} from '@/components/header/index'
import { ComutadorTema } from '@/components/theme/comutador-tema'
import { Organizacao } from '@/interfaces/organizacao'

type HeaderProps = {
  organizacoes: Organizacao[]
  organizacaoAtual?: Organizacao
}

export function Header({ organizacoes, organizacaoAtual }: HeaderProps) {
  return (
    <MainHeader className="border-b border-border pb-6">
      <HeaderContent>
        <HeaderContentLeft>
          <Image
            src={appIcon}
            className="hidden size-6 dark:invert sm:block"
            alt="Logo do portal agendador"
          />
          <Slash className="hidden size-3 -rotate-[24deg] text-border sm:block" />
          <EmpresaSwitcher organizacaoAtual={organizacaoAtual}>
            <EmpresaSwitcherContent label="Estabelecimentos">
              {organizacoes.map((org) => {
                const isCurrent = org.slug === organizacaoAtual?.slug
                return (
                  <EmpresaSwitcherItem
                    key={org.id}
                    isCurrent={isCurrent}
                    organizacao={org}
                    url={`/app/${org.slug}`}
                  />
                )
              })}
            </EmpresaSwitcherContent>
          </EmpresaSwitcher>
        </HeaderContentLeft>
        <HeaderContentRight>
          <ComutadorTema />
        </HeaderContentRight>
      </HeaderContent>
    </MainHeader>
  )
}
