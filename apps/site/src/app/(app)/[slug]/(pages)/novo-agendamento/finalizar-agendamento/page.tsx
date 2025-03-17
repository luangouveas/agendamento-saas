import { AlertTriangle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertTitle } from '@/components/ui/alert'

import { buscarPerfilDoUsuarioLogado } from '../../actions'
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

  const {
    success,
    data: dados,
    message,
  } = await buscarDadosDoAgendamentoParaFinalizar(
    slug,
    servicoId!,
    profissionalId!,
  )

  const {
    success: successPerfilUsuario,
    usuario,
    message: messagePerfilUsuario,
  } = await buscarPerfilDoUsuarioLogado()

  const dadosAgendamento = {
    slug,
    data,
    hora,
    servicoId: dados?.dadosServico.id,
    nomeServico: dados?.dadosServico.nome,
    profissionalId: dados?.dadosProfissional.id,
    nomeProfissional: dados?.dadosProfissional.nome,
    avatarProfissionalUrl: dados?.dadosProfissional.avatarUrl,
    usuario,
    valor: dados?.dadosServico.valor,
  }

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-row justify-between">
        <Link
          href={`/${slug}/novo-agendamento/escolher-horario?servicoId=${servicoId}&profissionalId=${profissionalId}`}
        >
          <ChevronLeft
            size={24}
            className="text-muted-foreground hover:text-foreground"
          />
        </Link>
        <h2 className="text-center font-semibold">
          Confirme os dados do agendamento
        </h2>
        <div className="min-w-6" />
      </div>
      {success && successPerfilUsuario ? (
        <ConfirmarAgendamentoClienteForm dadosAgendamento={dadosAgendamento} />
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message || messagePerfilUsuario}</p>
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}
