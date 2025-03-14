import { HTTPError } from 'ky'

import { buscarPerfil } from '@/http/buscar-perfil'

export async function buscarPerfilDoUsuarioLogado() {
  try {
    const usuario = await buscarPerfil()

    return {
      success: true,
      message: null,
      usuario,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, perfilUsuario: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      perfilUsuario: null,
    }
  }
}
