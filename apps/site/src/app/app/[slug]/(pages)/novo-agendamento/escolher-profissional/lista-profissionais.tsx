import { AlertTriangle } from 'lucide-react'
import React from 'react'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Alert, AlertTitle } from '@/components/ui/alert'

import { consultarListaDeProfissionaisDaOrganizacao } from './actions'
import ProfissionalComponent from './profissional-component'

export default async function ListaProfissionais() {
  const slug = await getSlugOrganizacaoAtual()
  const { data: profissionais, message } =
    await consultarListaDeProfissionaisDaOrganizacao(slug!)

  return (
    <div className="flex flex-col gap-5">
      {profissionais ? (
        profissionais.map((profissional) => (
          <ProfissionalComponent
            key={profissional.id}
            slug={slug!}
            profissional={profissional}
          />
        ))
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}
