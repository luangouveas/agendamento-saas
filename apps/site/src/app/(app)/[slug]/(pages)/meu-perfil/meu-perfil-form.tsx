'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertTitle } from '@/components/ui/alert'
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

import { atualizarDadosDoPerfilDoUsuario, uploadAvatarAction } from './actions'

const formPerfilUsuarioSchema = z.object({
  nome: z.string().min(3, {
    message: 'O nome é obrigatório.',
  }),
  email: z.string().optional(),
  avatarUrl: z.string().optional(),
  numeroCelular: z.string().min(5, {
    message: 'O número do celular é obrigatório.',
  }),
})

export type FormPerfilUsuario = z.infer<typeof formPerfilUsuarioSchema>

export default function MeuPerfilForm({ usuario }: { usuario: DadosUsuario }) {
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<FormPerfilUsuario>({
    resolver: zodResolver(formPerfilUsuarioSchema),
    defaultValues: {
      numeroCelular: usuario.numeroCelular,
      nome: usuario.nome || '',
      email: usuario.email || undefined,
      avatarUrl: usuario.avatarUrl || undefined,
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

  function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const avatarFile = event.target.files[0]
      console.log(avatarFile)
      uploadAvatarAction('teste', avatarFile).then((result) => {
        console.log(result)
      })
    }
  }

  return (
    <div>
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

          <div className="space-y-1">
            <FormField
              control={control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="avatarUrl">Foto</Label>
                  <FormControl onChange={uploadAvatar}>
                    <Input type="file" {...field} />
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

      {message && (
        <div className="mt-2">
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
    </div>
  )
}
