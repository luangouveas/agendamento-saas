'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { currency } from 'remask'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import {
  atualizarServicoAction,
  criarServicoAction,
  ServicoSchema,
} from './actions'

interface ServicoFormProps {
  initialData?: ServicoSchema
  isUpdating: boolean
}

export default function ServicoForm({
  initialData,
  isUpdating,
}: ServicoFormProps) {
  const handleSubmitAction = isUpdating
    ? atualizarServicoAction
    : criarServicoAction

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(handleSubmitAction)

  const mascarar = (valor: number) => {
    return currency.mask({
      locale: 'pt-BR',
      currency: 'BRL',
      value: valor,
    })
  }

  const [valorServico, setValorServico] = useState<string>(
    mascarar(initialData?.valor ?? 0),
  )

  const onChangeValorServico = (e: ChangeEvent<HTMLInputElement>) => {
    const val = currency.unmask({
      locale: 'pt-BR',
      currency: 'BRL',
      value: e.target.value,
    })
    setValorServico(mascarar(val))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <Input
        name="id"
        type="text"
        defaultValue={initialData?.id ?? undefined}
      />
      {errors?.id && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {errors.id[0]}
        </p>
      )}

      <div className="space-y-1">
        <Label>Nome</Label>
        <Input
          name="nome"
          type="text"
          defaultValue={initialData?.nome ?? undefined}
        />
        {errors?.nome && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.nome[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Descrição</Label>
        <Input
          name="descricao"
          type="text"
          defaultValue={initialData?.descricao ?? undefined}
        />
        {errors?.descricao && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.descricao[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Valor</Label>
        <Input
          name="valor"
          type="text"
          value={valorServico}
          onChange={onChangeValorServico}
        />
        {errors?.valor && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.valor[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Tempo (minutos) </Label>
        <Input
          name="tempo"
          type="number"
          defaultValue={initialData?.tempo ?? undefined}
        />
        {errors?.tempo && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.tempo[0]}
          </p>
        )}
      </div>

      <div className="flex w-full justify-end">
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar serviço'
          )}
        </Button>
      </div>
    </form>
  )
}
