import { cookies } from 'next/headers'

export function usuarioEstaAutenticado() {
  return !!cookies().get('agendador-token')?.value
}

export function getSlugOrganizacaoAtual() {
  return cookies().get('agendador-organizacao')?.value ?? null
}
