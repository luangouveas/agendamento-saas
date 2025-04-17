'use client'

import { addHours, format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { mask, unmask } from 'remask'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'
import { IPerfilUsuario } from '@/interfaces/usuario'
import { ConsultarCEP } from '@/services/brasil-api/consultar-cep'

import { AtualizarPerfilUsuarioAction } from './actions'

interface MeuPerfilProps {
  perfilUsuario: IPerfilUsuario
}

const mascaraCep = '99999-999'

const mascararCep = (val: string) => {
  return mask(val, mascaraCep)
}

export default function MeuPerfilForm({ perfilUsuario }: MeuPerfilProps) {
  const [consultandoCep, setConsultandoCep] = useState(false)
  const [cep, setCep] = useState(mascararCep(perfilUsuario.cep ?? ''))
  const [rua, setRua] = useState(perfilUsuario.rua ?? '')
  const [bairro, setBairro] = useState(perfilUsuario.bairro ?? '')
  const [cidade, setCidade] = useState(perfilUsuario.cidade ?? '')
  const [uf, setUf] = useState(perfilUsuario.estado ?? '')

  function consultarDadosEndereco(cep: string) {
    const cepOriginal = Number(unmask(cep))
    setConsultandoCep(true)

    ConsultarCEP({ cep: cepOriginal })
      .then((ret) => {
        setRua(ret.street)
        setBairro(ret.neighborhood)
        setCidade(ret.city)
        setUf(ret.state)
      })
      .catch(() => {
        setRua('')
        setBairro('')
        setCidade('')
        setUf('')

        toast({
          variant: 'destructive',
          description: 'Não conseguiu localizar o CEP informado.',
        })
      })
      .finally(() => setConsultandoCep(false))
  }

  const [{ errors }, handleSubmit, isPending] = useFormState(
    AtualizarPerfilUsuarioAction,
    (message) => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: message,
      })
    },
    (message) => {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: message,
      })
    },
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-2">
      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label>Nome</Label>
          <Input
            name="nome"
            type="text"
            defaultValue={perfilUsuario.nome ?? undefined}
          />
          {errors?.nome && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.nome[0]}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label>E-mail</Label>
          <Input
            name="email"
            type="email"
            disabled={true}
            defaultValue={perfilUsuario.email!}
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label>Data de Nascimento</Label>
          <Input
            name="dataNascimento"
            type="date"
            defaultValue={
              perfilUsuario.dataNascimento
                ? format(
                    addHours(perfilUsuario.dataNascimento, 3),
                    'yyyy-MM-dd',
                  )
                : undefined
            }
          />
          {errors?.dataNascimento && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.dataNascimento[0]}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label>Telefone</Label>
          <Input
            name="numeroCelular"
            type="text"
            defaultValue={perfilUsuario.numeroCelular}
          />
          {errors?.numeroCelular && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.numeroCelular[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label>CEP</Label>
          <Input
            name="cep"
            type="text"
            value={cep}
            onChange={(e) => setCep(mascararCep(e.target.value))}
            onBlur={(e) => consultarDadosEndereco(e.target.value)}
          />
          {errors?.cep && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cep[0]}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            Rua
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="rua"
            type="text"
            disabled={consultandoCep}
            value={rua}
            onChange={(e) => setRua(e.target.value)}
          />
          {errors?.rua && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.rua[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            Bairro
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="bairro"
            type="text"
            disabled={consultandoCep}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
          {errors?.bairro && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.bairro[0]}
            </p>
          )}
        </div>
        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            Cidade
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="cidade"
            type="text"
            disabled={consultandoCep}
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          {errors?.cidade && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cidade[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            UF
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="estado"
            type="text"
            disabled={consultandoCep}
            value={uf}
            onChange={(e) => setUf(e.target.value)}
          />
          {errors?.estado && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.estado[0]}
            </p>
          )}
        </div>
      </div>

      <Button
        className="mt-4"
        type="submit"
        disabled={isPending || consultandoCep}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Salvando...
          </>
        ) : (
          'Salvar'
        )}
      </Button>
    </form>
  )
}
