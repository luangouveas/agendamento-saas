import { api } from './api-client'

interface UploadAvatarRequest {
  id: string
  tipo: 'estabelecimentos' | 'servicos' | 'usuarios'
  avatarUrl: string
}

type UploadAvatarResponse = void

export async function AtualizarAvatarUrl({
  avatarUrl,
  id,
  tipo,
}: UploadAvatarRequest): Promise<UploadAvatarResponse> {
  await api.patch('arquivos/atualizar-avatar', {
    json: {
      id,
      tipo,
      avatarUrl,
    },
  })
}
