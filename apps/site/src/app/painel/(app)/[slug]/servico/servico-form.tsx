'use client'

import { ImageUp, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useRef, useState } from 'react'
import { currency } from 'remask'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'
import { IServico } from '@/interfaces/servico'

import {
  atualizarServicoAction,
  criarServicoAction,
  UploadAvatarServicoAction,
} from './actions'

interface ServicoFormProps {
  initialData?: IServico
  isUpdating: boolean
}

export default function ServicoForm({
  initialData,
  isUpdating,
}: ServicoFormProps) {
  const router = useRouter()

  const handleSubmitAction = isUpdating
    ? atualizarServicoAction
    : criarServicoAction

  const [{ errors }, handleSubmit, isPending] = useFormState(
    handleSubmitAction,
    (message) => {
      toast({
        title: 'Sucesso!',
        variant: 'success',
        description: message,
      })
      router.back()
    },
    (message) => {
      toast({
        title: 'Erro!',
        variant: 'destructive',
        description: message,
      })
    },
  )

  const mascarar = (valor: number) => {
    return currency.mask({
      locale: 'pt-BR',
      currency: 'BRL',
      value: valor,
    })
  }

  const [valorServico, setValorServico] = useState<string>(
    mascarar(initialData?.valor ?? 0),
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [valInputAvatar, setValInputAvatar] = useState('')

  const onChangeValorServico = (e: ChangeEvent<HTMLInputElement>) => {
    const val = currency.unmask({
      locale: 'pt-BR',
      currency: 'BRL',
      value: e.target.value,
    })
    setValorServico(mascarar(val))
  }

  async function uploadAvatar(file: File) {
    setIsUploading((prev) => !prev)
    toast({
      variant: 'default',
      title: 'Aguarde!',
      description: 'O arquivo está sendo carregado.',
    })
    if (file.type.lastIndexOf('image/') < 0) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'O arquivo selecionao não é uma imagem.',
      })
    } else {
      const result = await UploadAvatarServicoAction(
        initialData!.id,
        file,
        initialData!.avatarUrl,
      )
      toast({
        variant: result.success ? 'success' : 'destructive',
        title: result.success ? 'Sucesso' : 'Erro!',
        description: result.message,
      })
    }
    setIsUploading((prev) => !prev)
    setIsHovered(false)
    setValInputAvatar('')
  }

  return (
    <>
      {isUpdating && initialData && (
        <>
          <div
            className="relative size-24"
            onMouseEnter={() => setIsHovered((prev) => !prev)}
            onMouseLeave={() => setIsHovered((prev) => !prev)}
            aria-disabled={isUploading}
            role="button"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            {isUploading && (
              <Avatar className="border-secondary-foreground-foreground size-24 rounded-full border-2 hover:cursor-pointer">
                <AvatarFallback>
                  <Loader2 className="size-8 animate-spin text-slate-300" />
                </AvatarFallback>
              </Avatar>
            )}

            {!isUploading && (
              <Avatar className="border-secondary-foreground-foreground size-24 rounded-full border-2 hover:cursor-pointer">
                <AvatarImage
                  src={initialData.avatarUrl ?? ''}
                  className={isHovered ? 'blur-sm' : ''}
                />
                <AvatarFallback />
              </Avatar>
            )}

            {isHovered && !isUploading && (
              <div className="absolute inset-0 flex size-24 items-center justify-center rounded-full">
                <ImageUp className="size-7" />
              </div>
            )}
          </div>

          <Input
            ref={fileInputRef}
            name="teste"
            type="file"
            value={valInputAvatar}
            accept="image/png, image/gif, image/jpeg, image/jpg"
            className="absolute right-[9999px]"
            disabled={isUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                await uploadAvatar(file)
              }
            }}
          />
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="id"
          type="hidden"
          defaultValue={initialData?.id ?? undefined}
        />
        {errors?.id && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.id[0]}
          </p>
        )}

        <div className="space-y-1">
          <Label>Nome</Label>
          <Input
            name="nome"
            type="text"
            defaultValue={initialData?.nome ?? undefined}
          />
          {errors?.nome && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.nome[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Descrição</Label>
          <Input
            name="descricao"
            type="text"
            defaultValue={initialData?.descricao ?? undefined}
          />
          {errors?.descricao && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.descricao[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Valor</Label>
          <Input
            name="valor"
            type="text"
            value={valorServico}
            onChange={onChangeValorServico}
          />
          {errors?.valor && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.valor[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Tempo (minutos) </Label>
          <Input
            name="tempo"
            type="number"
            defaultValue={initialData?.tempo ?? undefined}
          />
          {errors?.tempo && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.tempo[0]}
            </p>
          )}
        </div>

        <div className="flex w-full justify-end">
          <Button type="submit" disabled={isPending || isUploading} size="sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar serviço'
            )}
          </Button>
        </div>
      </form>
    </>
  )
}
