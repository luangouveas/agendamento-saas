import { AlertTriangle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertTitle } from '@/components/ui/alert'

import { buscarDadosDoAgendamentoParaFinalizar } from './actions'
import ConfirmarAgendamentoClienteForm from './confirmacao-agendamento'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function FinalizarAgendamentoPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = await props.params
  const {
    servicoId = '',
    profissionalId = '',
    data = '',
    hora = '',
  } = await props.searchParams

  const { data: dados, message } = await buscarDadosDoAgendamentoParaFinalizar(
    slug,
    servicoId!,
    profissionalId!,
  )

  const dadosAgendamento = {
    data,
    hora,
    servicoId: dados?.dadosServico.id,
    nomeServico: dados?.dadosServico.nome,
    profissionalId: dados?.dadosProfissional.id,
    nomeProfissional: dados?.dadosProfissional.nome,
    avatarProfissionalUrl: dados?.dadosProfissional.avatarUrl,
  }

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-row justify-between">
        <Link
          href={`/agendador/${slug}/escolher-horario?servicoId=${servicoId}&profissionalId=${profissionalId}`}
        >
          <ChevronLeft size={24} className="text-muted-foreground" />
        </Link>
        <h2 className="text-center font-semibold">
          Confirme os dados do agendamento
        </h2>
        <div className="min-w-6" />
      </div>
      {dados ? (
        <ConfirmarAgendamentoClienteForm dadosAgendamento={dadosAgendamento} />
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
