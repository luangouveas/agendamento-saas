'use client'

import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { finalizarAgendamento } from './actions'

interface ConfirmarAgendamentoClienteFormProps {
  dadosAgendamento: {
    servicoId?: string
    nomeServico?: string
    profissionalId?: string
    nomeProfissional?: string
    data: string
    hora: string
  }
}

export default function ConfirmarAgendamentoClienteForm({
  dadosAgendamento,
}: ConfirmarAgendamentoClienteFormProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  function handleCriarAgendamento(dataForm: FormData) {
    const [dia, mes, ano] = dadosAgendamento.data.split('/').map(Number)
    const [horas, minutos] = dadosAgendamento.hora.split(':').map(Number)
    const date = new Date(ano, mes - 1, dia, horas - 3, minutos)
    const dataHora = date.toISOString()

    finalizarAgendamento({
      servicoId: dadosAgendamento.servicoId,
      profissionalId: dadosAgendamento.profissionalId,
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
    <div className="space-y-4 px-4">
      {success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      )}

      <>
        <h2 className="text-center font-semibold">
          Confirme os dados do agendamento
        </h2>

        <form action={handleCriarAgendamento} className="mt-4">
          <div>{dadosAgendamento.nomeServico}</div>
          <div>{dadosAgendamento.nomeProfissional}</div>
          <div>
            {dadosAgendamento.data} - {dadosAgendamento.hora}
          </div>
          <div className="mt-4">
            <Button type="submit">Confirmar agendamento !</Button>
          </div>
        </form>
      </>
    </div>
  )
}
