'use client'

import { Loader2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CriarConviteForm() {
  const isPending = false
  return (
    <form className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Input name="email" type="email" placeholder="email@exemplo.com" />
        </div>

        <Select name="role" defaultValue="ATENTENTE">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ATENTENTE">Atendente</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Associar profissional
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
