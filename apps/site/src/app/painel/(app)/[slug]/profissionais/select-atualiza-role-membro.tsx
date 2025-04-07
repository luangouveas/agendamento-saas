'use client'

import { Role } from '@agendamento-saas/auth'
import { ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { atualizarRoleMembroAction } from './actions'

interface SelectAtualizaRoleMembroProps extends ComponentProps<typeof Select> {
  membroId: string
}

export function SelectAtualizaRoleMembro({
  membroId,
  ...props
}: SelectAtualizaRoleMembroProps) {
  async function updateMemberRole(role: Role) {
    await atualizarRoleMembroAction(membroId, role)
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="h-8 w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="ATENDENTE">Atendente</SelectItem>
      </SelectContent>
    </Select>
  )
}
