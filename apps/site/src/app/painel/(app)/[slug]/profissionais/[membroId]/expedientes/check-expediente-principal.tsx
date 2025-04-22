'use client'

import { ComponentProps } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'

import { MarcarExpedientePrincipalAction } from './actions'

interface CheckExpedientePrincipalProps
  extends ComponentProps<typeof Checkbox> {
  membroId: string
  expedienteId: string
}

export function CheckExpedientePrincipal({
  expedienteId,
  membroId,
  ...props
}: CheckExpedientePrincipalProps) {
  async function handleMarcarExpedientePrincipal() {
    const ret = await MarcarExpedientePrincipalAction(membroId, expedienteId)

    toast({
      variant: ret.success ? 'success' : 'destructive',
      title: ret.success ? 'Sucesso!' : 'Erro!',
      description: ret.message,
    })
  }

  return (
    <div className="mr-10 flex items-center">
      <Checkbox
        id={`chk${expedienteId}`}
        onCheckedChange={() => handleMarcarExpedientePrincipal()}
        {...props}
      />
      <label
        htmlFor={`chk${expedienteId}`}
        className="text-sm text-muted-foreground"
      >
        Expediente principal
      </label>
    </div>
  )
}
