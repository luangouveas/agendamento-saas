import { cookies } from 'next/headers'

export async function usuarioEstaAutenticado() {
  return !!(await cookies()).get('agendador-token')?.value
}

export async function getSlugOrganizacaoAtual() {
  return (await cookies()).get('agendador-organizacao')?.value ?? null
}
