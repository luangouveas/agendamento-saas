'use client'

import { createContext, ReactNode, useState } from 'react'

import { IProfissional } from '@/interfaces/profissional'
import { IServico } from '@/interfaces/servico'

interface IAgendamentoContext {
  servico: IServico | null
  escolherServico: (servico: IServico | null) => void
  profissional: IProfissional | null
  escolherProfissional: (profissional: IProfissional | null) => void
  dataHora: string | null
  escolherHorario: (dataHora: string | null) => void
  zerarContextoDeAgendamento: () => void
}

export const AgendamentoContext = createContext<IAgendamentoContext>(
  {} as IAgendamentoContext,
)

export const AgendamentoProvider = ({ children }: { children: ReactNode }) => {
  const [servico, setServico] = useState<IServico | null>(null)
  const [profissional, setProfissional] = useState<IProfissional | null>(null)
  const [dataHora, setDataHora] = useState<string | null>(null)

  function escolherServico(servico: IServico | null) {
    setServico(servico)
  }

  function escolherProfissional(profissional: IProfissional | null) {
    setProfissional(profissional)
  }

  function escolherHorario(dataHora: string | null) {
    setDataHora(dataHora)
  }

  function zerarContextoDeAgendamento() {
    setServico(null)
    setProfissional(null)
    setDataHora(null)
  }

  return (
    <AgendamentoContext.Provider
      value={{
        servico,
        profissional,
        dataHora,
        escolherServico,
        escolherProfissional,
        escolherHorario,
        zerarContextoDeAgendamento,
      }}
    >
      {children}
    </AgendamentoContext.Provider>
  )
}
