import { AlertTriangle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertTitle } from '@/components/ui/alert'

import { buscarPerfilDoUsuarioLogado } from '../../actions'
import ConfirmarAgendamentoClienteForm from './confirmacao-agendamento'

type Params = Promise<{ slug: string }>

export default async function FinalizarAgendamentoPage(props: {
  params: Params
}) {
  const { slug } = await props.params

  const { success, usuario, message } = await buscarPerfilDoUsuarioLogado()

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-row justify-between">
        <Link href={`/${slug}/novo-agendamento/escolher-horario`}>
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
      {success && usuario ? (
        <ConfirmarAgendamentoClienteForm slug={slug} dadosUsuario={usuario!} />
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
