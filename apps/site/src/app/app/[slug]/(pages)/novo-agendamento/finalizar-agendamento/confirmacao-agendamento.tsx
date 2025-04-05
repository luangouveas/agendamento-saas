'use client'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useContext, useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AgendamentoContext } from '@/context/agendamento-context'
import { IUsuario } from '@/interfaces/usuario'

import MeuPerfilForm from '../../meu-perfil/meu-perfil-form'
import { finalizarAgendamento } from './actions'

interface ConfirmarAgendamentoClienteFormProps {
  slug: string
  dadosUsuario: IUsuario
}

export default function ConfirmarAgendamentoClienteForm({
  slug,
  dadosUsuario,
}: ConfirmarAgendamentoClienteFormProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const {
    servico,
    profissional,
    dataHora: diaHorarioEscolhido,
    zerarContextoDeAgendamento,
  } = useContext(AgendamentoContext)

  if (!servico || !profissional || !diaHorarioEscolhido) {
    redirect(`/app/${slug}/novo-agendamento`)
  }

  const dataEscolhida = diaHorarioEscolhido!.split('-')[0]
  const horaEscolhida = diaHorarioEscolhido!.split('-')[1]

  function handleCriarAgendamento() {
    const [dia, mes, ano] = dataEscolhida.split('/').map(Number)
    const [horas, minutos] = horaEscolhida.split(':').map(Number)
    const date = new Date(ano, mes - 1, dia, horas - 3, minutos)
    const dataHora = date.toISOString()

    setIsSubmitting(true)

    finalizarAgendamento({
      servicoId: servico!.id!,
      profissionalId: profissional!.membroId,
      dataHora,
      valor: servico!.valor,
    }).then((result) => {
      setIsSubmitting(false)
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        setSuccess(true)
        setMessage(result!.message)
        // zerarContextoDeAgendamento()

        redirect(`/app/${slug}/meus-agendamentos`)
      }
    })
  }

  return (
    <>
      {dadosUsuario.nome !== '' ? (
        <div className="flex h-[530px] flex-col justify-between">
          <div>
            <div className="mt-8 flex flex-col">
              <div className="flex flex-row items-center gap-2">
                <Avatar className="size-16">
                  {profissional?.avatarUrl && (
                    <AvatarImage src={profissional.avatarUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xl font-medium">
                    {servico!.nome} - R$ {servico!.valor}
                  </span>
                  <span>{profissional!.nome}</span>
                  <span className="text-sm text-muted-foreground">
                    {dataEscolhida} - {horaEscolhida}
                  </span>
                </div>
              </div>
            </div>

            {message && (
              <div className="mt-8 flex w-full items-center justify-center">
                <Alert
                  variant={success ? 'success' : 'danger'}
                  className="max-w-md"
                >
                  {success ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <AlertTriangle className="size-4" />
                  )}
                  <AlertTitle>
                    <p>{message}</p>
                  </AlertTitle>
                </Alert>
              </div>
            )}
          </div>

          <div className="bottom-0 mt-4 w-full pb-4">
            <Button
              type="submit"
              onClick={handleCriarAgendamento}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Confirmar agendamento !'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Alert
            variant="alert"
            className="flex w-full items-center justify-center"
          >
            <AlertTriangle className="size-4" />
            <AlertTitle>
              Você precisa confirmar seus dados antes de prosseguir !
            </AlertTitle>
          </Alert>

          <MeuPerfilForm usuario={dadosUsuario} />
        </>
      )}
    </>
  )
}
