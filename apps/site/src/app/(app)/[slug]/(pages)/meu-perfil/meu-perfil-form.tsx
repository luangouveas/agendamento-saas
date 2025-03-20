'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DadosUsuario } from '@/http/buscar-perfil'

import { atualizarDadosDoPerfilDoUsuario } from './actions'

const formPerfilUsuarioSchema = z.object({
  nome: z.string().min(3, {
    message: 'O nome é obrigatório.',
  }),
  email: z.string().optional(),
  numeroCelular: z.string().min(5, {
    message: 'O número do celular é obrigatório.',
  }),
})

export type FormPerfilUsuario = z.infer<typeof formPerfilUsuarioSchema>

export default function MeuPerfilForm({ usuario }: { usuario: DadosUsuario }) {
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<FormPerfilUsuario>({
    resolver: zodResolver(formPerfilUsuarioSchema),
    defaultValues: {
      numeroCelular: usuario.numeroCelular,
      nome: usuario.nome || '',
      email: usuario.email || undefined,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form

  function handleUpdatePerfil(formData: FormPerfilUsuario) {
    setIsSubmitting(true)
    atualizarDadosDoPerfilDoUsuario(formData).then((result) => {
      if (!result?.success) {
        setMessage(result.message)
        setSuccess(false)
      } else {
        setMessage('Dados atualizados com sucesso!')
        setSuccess(true)
      }
      setIsSubmitting(false)
    })
  }

  async function uploadAvatar(avatarFile: File) {
    setAvatarUrl(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.set('file', avatarFile)
    formData.set('idClinte', usuario.id)

    const response = await fetch('/api/usuario-avatar', {
      method: 'POST',
      body: formData,
    })

    const signedUrl = await response.json()

    setAvatarUrl(signedUrl)

    setIsUploading(false)
  }

  async function getAvatar() {
    setIsUploading(true)
    const response = await fetch(`/api/usuario-avatar?idClinte=${usuario.id}`, {
      method: 'get',
    })

    const ret = await response.json()

    if (response.ok) {
      setAvatarUrl(ret)
    } else {
      setMessage(ret.error)
    }
    setIsUploading(false)
  }

  useEffect(() => {
    getAvatar()
  }, [])

  return (
    <div>
      <div className="flex w-full justify-center py-3">
        <Avatar
          className="border-secondary-foreground-foreground size-32 border-4 hover:cursor-pointer"
          aria-disabled={isUploading}
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          {isUploading ? (
            <AvatarFallback>
              <Loader2 className="size-8 animate-spin" />
            </AvatarFallback>
          ) : avatarUrl ? (
            <AvatarImage src={avatarUrl} />
          ) : (
            <AvatarFallback />
          )}
        </Avatar>
      </div>
      {message && (
        <div className="my-2 text-center">
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
        </div>
      )}
      <Input
        ref={fileInputRef}
        type="file"
        className="absolute right-[9999px]"
        disabled={isUploading}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            await uploadAvatar(file)
          }
        }}
      />
      <Form {...form}>
        <form onSubmit={handleSubmit(handleUpdatePerfil)} className="space-y-2">
          <div className="space-y-1">
            <FormField
              control={control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nome">Nome</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">E-mail</Label>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1">
            <FormField
              control={control}
              name="numeroCelular"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="numeroCelular">Telefone</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <Button type="submit" className="w-full" disabled={!isValid}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Salvar dados'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
