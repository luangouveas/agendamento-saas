'use client'

import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BuscarPerfilResponse } from '@/http/buscar-perfil'

import MeuPerfilForm from '../meu-perfil/meu-perfil-form'
import { finalizarAgendamento } from './actions'

interface ConfirmarAgendamentoClienteFormProps {
  dadosAgendamento: {
    servicoId?: string
    nomeServico?: string
    profissionalId?: string
    nomeProfissional?: string
    avatarProfissionalUrl?: string | null
    data: string
    hora: string
    usuario?: BuscarPerfilResponse | null
  }
}

export default function ConfirmarAgendamentoClienteForm({
  dadosAgendamento,
}: ConfirmarAgendamentoClienteFormProps) {
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
    }).then((result) => {
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        setSuccess(true)
        setMessage(null)
      }
    })
  }

  return (
    <>
      {dadosAgendamento.usuario?.usuario.nome === '' ? (
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

            {!success && message && (
              <div className="mt-8 flex w-full items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                  <AlertTriangle className="size-4" />
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
            variant="default"
            className="flex w-full items-center justify-center"
          >
            <AlertTriangle className="size-4" />
            <AlertTitle className="">
              Você precisa confirmar seus dados antes de prosseguir !
            </AlertTitle>
          </Alert>

          <MeuPerfilForm usuario={dadosAgendamento.usuario!.usuario} />
        </>
      )}
    </>
  )
}
