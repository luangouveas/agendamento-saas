'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import {
  AtualizarExpedienteAction,
  CriarExpedienteAction,
  ExpedienteSchema,
} from './actions'

interface ExpedienteFormProps {
  className?: string
  isUpdating: boolean
  initialData?: Omit<ExpedienteSchema, 'membroId'>
  membroId: string
}

const diasDaSemana = [
  {
    index: 1,
    nome: 'Domingo',
  },
  {
    index: 2,
    nome: 'Segunda-feira',
  },
  {
    index: 3,
    nome: 'Terça-feira',
  },
  {
    index: 4,
    nome: 'Quarta-feira',
  },
  {
    index: 5,
    nome: 'Quinta-feira',
  },
  {
    index: 6,
    nome: 'Sexta-feira',
  },
  {
    index: 7,
    nome: 'Sabado',
  },
]

export default function ExpedienteForm({
  className,
  isUpdating,
  initialData,
  membroId,
}: ExpedienteFormProps) {
  const actionSubmit = isUpdating
    ? AtualizarExpedienteAction
    : CriarExpedienteAction

  const router = useRouter()

  const [, handleSubmit, isPending] = useFormState(
    actionSubmit,
    (message) => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: message,
      })
      // router.back()
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
    <form onSubmit={handleSubmit} className={cn(className, 'space-y-4')}>
      <Input
        name="id"
        type="hidden"
        defaultValue={initialData?.id ?? undefined}
      />
      <Input name="membroId" type="hidden" defaultValue={membroId} />

      <div className="space-y-1">
        <Label>Nome</Label>
        <Input
          name="nome"
          type="text"
          defaultValue={initialData?.nome ?? undefined}
        />
      </div>

      {diasDaSemana.map((dia, idx) => {
        const diaData = initialData?.diasExpediente.find(
          (d) => d.diaSemana === dia.index,
        )

        return (
          <fieldset key={dia.index} className="rounded-lg border p-2">
            <legend className="text-muted-foreground">{dia.nome}</legend>

            <input
              type="hidden"
              name={`diasExpediente[${idx}].diaSemana`}
              value={dia.index}
            />

            <div className="flex w-full flex-row gap-2">
              <div className="flex w-full flex-col space-y-1">
                <Label>Inicio</Label>
                <Input
                  type="time"
                  name={`diasExpediente[${idx}].inicio`}
                  defaultValue={diaData?.inicio || undefined}
                />
              </div>
              <div className="flex w-full flex-col space-y-1">
                <Label>Fim</Label>
                <Input
                  type="time"
                  name={`diasExpediente[${idx}].fim`}
                  defaultValue={diaData?.fim || undefined}
                />
              </div>
              <div className="flex w-full flex-col space-y-1">
                <Label>Intervalo Inicio</Label>
                <Input
                  type="time"
                  name={`diasExpediente[${idx}].inicioIntervalo`}
                  defaultValue={diaData?.inicioIntervalo || undefined}
                />
              </div>
              <div className="flex w-full flex-col space-y-1">
                <Label>Intervalo Fim</Label>
                <Input
                  type="time"
                  name={`diasExpediente[${idx}].fimIntervalo`}
                  defaultValue={diaData?.fimIntervalo || undefined}
                />
              </div>
            </div>
          </fieldset>
        )
      })}

      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Salvando...
          </>
        ) : (
          'Salvar expediente'
        )}
      </Button>
    </form>
  )
}
