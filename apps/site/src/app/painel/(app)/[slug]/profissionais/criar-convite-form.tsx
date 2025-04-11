'use client'

import { Loader2, UserPlus } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

import {
  AssociarUsuarioExistenteAction,
  BuscarUsuarioPorEmailAction,
  ConvidarNovoUsuarioAction,
} from './actions'

type Usuario = {
  id: string
  avatarUrl: string
  nome: string
}
export function CriarConviteForm() {
  const [email, setEmail] = useState<string>('')
  const [isPendingVerificar, setIsPendingVerificar] = useState(false)
  const [isVerificarEmail, setIsVerificarEmail] = useState(true)
  const [isPendingEnvioConvite, setIsPendingEnvioConvite] = useState(false)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [role, setRole] = useState<string>('ATENDENTE')

  function handleVarificarEmail() {
    setIsPendingVerificar(true)
    BuscarUsuarioPorEmailAction(email!)
      .then((ret) => {
        if (ret.success && ret.usuario) {
          setUsuario(ret.usuario)
          setIsVerificarEmail(false)
        } else if (ret.success && !ret.usuario) {
          setUsuario(null)
          setIsVerificarEmail(false)
        } else {
          setIsVerificarEmail(true)
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: ret.message,
          })
        }
      })
      .finally(() => {
        setIsPendingVerificar(false)
      })
  }

  function handleConvidarNovoUsuario() {
    setIsPendingEnvioConvite(true)

    ConvidarNovoUsuarioAction(email, role)
      .then((ret) => {
        toast({
          title: ret.success ? 'Sucesso!' : 'Erro!',
          variant: ret.success ? 'success' : 'destructive',
          description: ret.message,
        })
        if (ret.success) {
          setEmail('')
        }
      })
      .finally(() => {
        setIsVerificarEmail(true)
        setIsPendingEnvioConvite(false)
      })
  }

  function handleAssociarUsuario() {
    setIsPendingEnvioConvite(true)

    AssociarUsuarioExistenteAction(usuario!.id, role)
      .then((ret) => {
        toast({
          title: ret.success ? 'Sucesso!' : 'Erro!',
          variant: ret.success ? 'success' : 'destructive',
          description: ret.message,
        })
        if (ret.success) {
          setEmail('')
        }
      })
      .finally(() => {
        setIsVerificarEmail(true)
        setIsPendingEnvioConvite(false)
      })
  }

  return (
    <form onSubmit={() => {}} className="space-y-4">
      <div className="flex w-full gap-2">
        <div className="flex w-full flex-col items-center space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isVerificarEmail}
          />

          {!isVerificarEmail && usuario ? (
            <div className="flex w-[98%] flex-row gap-1 rounded-2xl border border-border p-4 text-muted-foreground hover:bg-zinc-500 hover:bg-opacity-15">
              <div className="flex w-full items-center gap-2">
                <Avatar>
                  {usuario.avatarUrl && (
                    <AvatarImage
                      width={32}
                      height={32}
                      src={usuario.avatarUrl}
                    />
                  )}
                  <AvatarFallback />
                </Avatar>

                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">{usuario.nome}</span>
                  <span>{email}</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-end gap-1">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsVerificarEmail(true)
                    setEmail('')
                  }}
                  disabled={isPendingEnvioConvite}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={handleAssociarUsuario}
                  disabled={isPendingEnvioConvite}
                >
                  {isPendingEnvioConvite && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Associar usuário
                </Button>
              </div>
            </div>
          ) : (
            !isVerificarEmail && (
              <div className="flex w-[98%] flex-row gap-1 rounded-2xl border border-border p-4 text-muted-foreground hover:bg-zinc-500 hover:bg-opacity-15">
                <div className="flex w-full items-center gap-2">
                  <Avatar>
                    <AvatarFallback />
                  </Avatar>

                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-semibold">{email}</span>
                    <span>
                      Este usuário não possui uma conta na plataforma.
                    </span>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-1">
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsVerificarEmail(true)
                      setEmail('')
                    }}
                    disabled={isPendingEnvioConvite}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleConvidarNovoUsuario}
                    disabled={isPendingEnvioConvite}
                  >
                    {isPendingEnvioConvite && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Convidar usuário
                  </Button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Select
            name="role"
            defaultValue="ATENTENTE"
            onValueChange={(value) => setRole(value)}
          >
            <SelectTrigger className="h-9 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="ATENTENTE">Atendente</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleVarificarEmail}
            disabled={isPendingVerificar || !isVerificarEmail}
            size="sm"
          >
            {isPendingVerificar ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 size-4" />
                Verificar E-mail
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
