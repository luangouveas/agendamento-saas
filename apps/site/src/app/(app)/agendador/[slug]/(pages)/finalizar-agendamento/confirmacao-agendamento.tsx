'use client'

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DadosUsuario } from '@/http/buscar-perfil'

import MeuPerfilForm from '../meu-perfil/meu-perfil-form'
import { finalizarAgendamento } from './actions'

interface ConfirmarAgendamentoClienteFormProps {
  dadosAgendamento: {
    slug: string
    servicoId?: string
    nomeServico?: string
    profissionalId?: string
    nomeProfissional?: string
    avatarProfissionalUrl?: string | null
    data: string
    hora: string
    usuario?: DadosUsuario | null
    valor?: number
  }
}

export default function ConfirmarAgendamentoClienteForm({
  dadosAgendamento,
}: ConfirmarAgendamentoClienteFormProps) {
  const router = useRouter()

  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  function handleCriarAgendamento() {
    const [dia, mes, ano] = dadosAgendamento.data.split('/').map(Number)
    const [horas, minutos] = dadosAgendamento.hora.split(':').map(Number)
    const date = new Date(ano, mes - 1, dia, horas - 3, minutos)
    const dataHora = date.toISOString()

    finalizarAgendamento({
      servicoId: dadosAgendamento.servicoId!,
      profissionalId: dadosAgendamento.profissionalId!,
      dataHora,
      valor: dadosAgendamento.valor!,
    }).then((result) => {
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        setSuccess(true)
        setMessage(result!.message)

        router.push(`/agendador/${dadosAgendamento.slug}/meus-agendamentos`)
      }
    })
  }

  return (
    <>
      {dadosAgendamento.usuario?.nome !== '' ? (
        <div className="flex h-[530px] flex-col justify-between">
          <div>
            <div className="mt-8 flex flex-col">
              <div className="flex flex-row items-center gap-2">
                <Avatar className="size-16">
                  {dadosAgendamento.avatarProfissionalUrl && (
                    <AvatarImage src={dadosAgendamento.avatarProfissionalUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xl font-medium">
                    {dadosAgendamento.nomeServico}
                  </span>
                  <span>{dadosAgendamento.nomeProfissional}</span>
                  <span className="text-sm text-muted-foreground">
                    {dadosAgendamento.data} - {dadosAgendamento.hora}
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
              Confirmar agendamento !
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

          <MeuPerfilForm usuario={dadosAgendamento.usuario!} />
        </>
      )}
    </>
  )
}
