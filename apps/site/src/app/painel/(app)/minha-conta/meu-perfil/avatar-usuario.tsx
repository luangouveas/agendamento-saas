'use client'

import { ImageUp, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { IUsuario } from '@/interfaces/usuario'

import { UploadAvatarUsuarioAction } from './actions'

interface AvatarUsuarioProps {
  usuario: IUsuario
  size: number
}

export default function AvatarUsuario({ usuario, size }: AvatarUsuarioProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [valInputAvatar, setValInputAvatar] = useState('')

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
      const result = await UploadAvatarUsuarioAction(
        usuario.id,
        file,
        usuario.avatarUrl,
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
      <div
        className={`size-${size} relative`}
        onMouseEnter={() => setIsHovered((prev) => !prev)}
        onMouseLeave={() => setIsHovered((prev) => !prev)}
        aria-disabled={isUploading}
        role="button"
        onClick={() => {
          fileInputRef.current?.click()
        }}
      >
        {isUploading && (
          <Avatar
            className={`border-secondary-foreground-foreground size-${size} rounded-3xl border-2 hover:cursor-pointer`}
          >
            <AvatarFallback>
              <Loader2 className="size-8 animate-spin text-slate-300" />
            </AvatarFallback>
          </Avatar>
        )}

        {!isUploading && (
          <Avatar
            className={`border-secondary-foreground-foreground size-${size} rounded-3xl border-2 hover:cursor-pointer`}
          >
            <AvatarImage
              src={usuario.avatarUrl ?? ''}
              className={isHovered ? 'blur-sm' : ''}
            />
            <AvatarFallback />
          </Avatar>
        )}

        {isHovered && !isUploading && (
          <div
            className={`absolute inset-0 flex size-${size} items-center justify-center rounded-3xl`}
          >
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
  )
}
