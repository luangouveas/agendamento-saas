'use client'

import { Role } from '@agendamento-saas/auth'
import { Loader2 } from 'lucide-react'
import { ComponentProps, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

import { atualizarRoleMembroAction } from './actions'

interface SelectAtualizaRoleMembroProps extends ComponentProps<typeof Select> {
  membroId: string
}

export function SelectAtualizaRoleMembro({
  membroId,
  ...props
}: SelectAtualizaRoleMembroProps) {
  const [isPending, setIsPending] = useState(false)

  async function updateMemberRole(role: Role) {
    setIsPending(true)
    const ret = await atualizarRoleMembroAction(membroId, role)

    toast({
      variant: ret.success ? 'success' : 'destructive',
      title: ret.success ? 'Sucesso!' : 'Erro!',
      description: ret.message,
    })

    setIsPending(false)
  }

  return (
    <>
      {isPending ? (
        <div className="flex h-8 w-32 cursor-default flex-row items-center rounded-lg border p-2">
          <Loader2 className="mr-2 size-3 animate-spin" />
          <span className="text-sm">Atualizando...</span>
        </div>
      ) : (
        <Select onValueChange={updateMemberRole} {...props}>
          <SelectTrigger className="h-8 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="ATENDENTE">Atendente</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>
  )
}
