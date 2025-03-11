import { AlertTriangle } from 'lucide-react'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { Alert, AlertTitle } from '@/components/ui/alert'

import { buscarDadosDoAgendamentoParaFinalizar } from './actions'

export default async function FinalizarAgendamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const slug = await getSlugOrganizacaoAtual()
  const {
    servicoId = '',
    profissionalId = '',
    data = '',
    hora = '',
  } = await searchParams

  const { data: dados, message } = await buscarDadosDoAgendamentoParaFinalizar(
    slug!,
    servicoId,
    profissionalId,
  )

  return (
    <div className="space-y-4 px-4">
      {dados ? (
        <>
          <h2 className="text-center font-semibold">
            Confirme os dados do agendamento
          </h2>

          <div>{dados.dadosServico.nome}</div>
          <div>
            {data} - {hora}
          </div>
          <div>{dados.dadosProfissional.nome}</div>
        </>
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
