'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Flag from 'react-world-flags'
import { mask, unMask } from 'remask'
import { z } from 'zod'

import Loading from '@/components/loading'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DadosUsuario } from '@/http/buscar-perfil'
import { paises } from '@/lib/paises'
import { mascarasTelefone } from '@/lib/utils'

import { atualizarDadosDoPerfilDoUsuario } from './actions'

const formPerfilUsuarioSchema = z.object({
  nome: z.string().min(3, {
    message: 'O nome é obrigatório.',
  }),
  ddi: z.string(),
  email: z.string().optional(),
  numeroCelular: z.string().min(5, {
    message: 'O número do celular é obrigatório.',
  }),
})

const buscarDDIPaisUsuario = (ddi: string) => {
  const pais = paises.find((p) => p.dial_code === ddi)!
  return `${pais.code} ${pais.dial_code}`
}

export type FormPerfilUsuario = z.infer<typeof formPerfilUsuarioSchema>

export default function MeuPerfilForm({ usuario }: { usuario: DadosUsuario }) {
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<FormPerfilUsuario>({
    resolver: zodResolver(formPerfilUsuarioSchema),
    defaultValues: {
      ddi: buscarDDIPaisUsuario(usuario.ddi),
      numeroCelular: mask(usuario.numeroCelular, mascarasTelefone),
      nome: usuario.nome || '',
      email: usuario.email || undefined,
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, isLoading },
  } = form

  function handleUpdatePerfil(formData: FormPerfilUsuario) {
    const celular = formData.numeroCelular.replace(/[ ()-]/g, '')
    const ddi = formData.ddi.split(' ')[1]
    const numeroCelular = ddi + ' ' + celular

    const dadosUsuario = {
      nome: formData.nome,
      email: formData.email,
      numeroCelular,
    }

    setIsSubmitting(true)
    atualizarDadosDoPerfilDoUsuario(dadosUsuario).then((result) => {
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
    if (avatarFile.type.lastIndexOf('image/') < 0) {
      setMessage('Este arquivo não é válido. Tente escolher uma imagem.')
    } else {
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

      setIsHovered(false)
      setAvatarUrl(signedUrl)
      setIsUploading(false)
    }
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
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex w-full justify-center py-3">
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-disabled={isUploading}
              role="button"
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              <Avatar className="border-secondary-foreground-foreground size-32 border-4 hover:cursor-pointer">
                {isUploading ? (
                  <AvatarFallback>
                    <Loader2 className="size-8 animate-spin text-slate-300" />
                  </AvatarFallback>
                ) : avatarUrl ? (
                  <AvatarImage src={avatarUrl} />
                ) : (
                  <AvatarFallback />
                )}
              </Avatar>

              {isHovered && !isUploading && (
                <div className="absolute inset-0 rounded-full bg-slate-200 bg-opacity-50"></div>
              )}
            </div>
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
            accept="image/png, image/gif image/jpeg"
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
            <form
              onSubmit={handleSubmit(handleUpdatePerfil)}
              className="flex flex-col gap-8"
            >
              <div className="space-y-2">
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
                          <Input
                            type="email"
                            placeholder="nome@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <FormField
                    control={control}
                    name="ddi"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label>DDI</Label>
                        <FormControl>
                          <Select
                            onValueChange={(val: string) => field.onChange(val)}
                            {...field}
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
                                      <Flag
                                        className="w-5 rounded-full"
                                        code={pais.code}
                                      />
                                      <span className="line-clamp-1 text-base">
                                        {pais.dial_code}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="numeroCelular"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="numeroCelular">Telefone</Label>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const original = unMask(e.target.value)
                              const mascarado = mask(original, mascarasTelefone)
                              setValue('numeroCelular', mascarado)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="w-[50%]" disabled={!isValid}>
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
      )}
    </>
  )
}
