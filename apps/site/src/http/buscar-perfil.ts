import { IPerfilUsuario } from '@/interfaces/usuario'

import { api } from './api-client'

interface BuscarPerfilResponse {
  usuario: IPerfilUsuario
}

export async function buscarPerfil() {
  const result = await api
    .get('perfil', {
      next: {
        tags: ['atualizou-perfil'],
      },
    })
    .json<BuscarPerfilResponse>()

  return result
}
