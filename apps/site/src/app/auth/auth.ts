import { cookies } from 'next/headers'

export function usuarioEstaAutenticado() {
  return !!cookies().get('agendador-token')?.value
}
