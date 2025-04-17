'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { currency } from 'remask'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'
import { IServico } from '@/interfaces/servico'

import { atualizarServicoAction, criarServicoAction } from './actions'

interface ServicoFormProps {
  initialData?: IServico
  isUpdating: boolean
}

export default function ServicoForm({
  initialData,
  isUpdating,
}: ServicoFormProps) {
  const router = useRouter()

  const handleSubmitAction = isUpdating
    ? atualizarServicoAction
    : criarServicoAction

  const [{ errors }, handleSubmit, isPending] = useFormState(
    handleSubmitAction,
    (message) => {
      toast({
        title: 'Sucesso!',
        variant: 'success',
        description: message,
      })
      router.back()
    },
    (message) => {
      toast({
        title: 'Erro!',
        variant: 'destructive',
        description: message,
      })
    },
  )

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
      <Input
        name="id"
        type="hidden"
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
