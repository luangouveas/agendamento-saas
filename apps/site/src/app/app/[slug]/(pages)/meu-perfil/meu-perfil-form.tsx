'use client'

import { addHours, format } from 'date-fns'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Flag from 'react-world-flags'
import { mask, unMask } from 'remask'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'
import { IPerfilUsuario } from '@/interfaces/usuario'
import { paises } from '@/lib/paises'
import { mascarasTelefone } from '@/lib/utils'

import { atualizarDadosDoPerfilDoUsuario } from './actions'

const buscarDDIPaisUsuario = (ddi: string) => {
  const pais = paises.find((p) => p.dial_code === ddi)!
  return `${pais.code} ${pais.dial_code}`
}

export default function MeuPerfilForm({
  usuario,
}: {
  usuario: IPerfilUsuario
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const [celular, setCelular] = useState(
    usuario.numeroCelular ? mask(usuario.numeroCelular, mascarasTelefone) : '',
  )

  const [{ errors }, handleSubmit, isPending] = useFormState(
    atualizarDadosDoPerfilDoUsuario,
    (message) => {
      setMessage(message)
      setSuccess(true)
    },
    (message) => {
      setMessage(message)
      setSuccess(false)
    },
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-2">
      {message && (
        <Alert variant={success ? 'success' : 'destructive'}>
          {success ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertTriangle className="size-4" />
          )}
          <AlertTitle className="">
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      )}

      <div className="space-y-1">
        <Label>Nome</Label>
        <Input
          name="nome"
          type="text"
          defaultValue={usuario.nome ?? undefined}
        />
        {errors?.nome && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.nome[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>E-mail</Label>
        <Input
          name="email"
          type="email"
          placeholder="email@exemplo.com"
          defaultValue={usuario.email ?? undefined}
          disabled={!!usuario.email}
        />
        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Nascimento</Label>
        <Input
          name="dataNascimento"
          type="date"
          defaultValue={
            usuario.dataNascimento
              ? format(addHours(usuario.dataNascimento, 3), 'yyyy-MM-dd')
              : undefined
          }
        />
        {errors?.dataNascimento && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.dataNascimento[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex flex-row gap-2">
          <div className="space-y-1">
            <Label>DDI</Label>
            <Select
              name="ddi"
              defaultValue={buscarDDIPaisUsuario(usuario.ddi ?? '+55')}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectGroup>
                  {paises.map((pais) => (
                    <SelectItem
                      key={`${pais.code} ${pais.dial_code}`}
                      value={`${pais.code} ${pais.dial_code}`}
                      className="items-left"
                    >
                      <div className="flex w-full flex-row justify-around gap-4">
                        <Flag className="w-5 rounded-full" code={pais.code} />
                        <span className="line-clamp-1 text-base">
                          {pais.dial_code}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors?.ddi && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.ddi[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Celular</Label>
            <Input
              name="numeroCelular"
              type="text"
              onChange={(e) => {
                const original = unMask(e.target.value)
                const mascarado = mask(original, mascarasTelefone)
                setCelular(mascarado)
              }}
              value={celular ?? undefined}
            />
            {errors?.numeroCelular && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.numeroCelular[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button className="mt-4" type="submit" disabled={isPending}>
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
