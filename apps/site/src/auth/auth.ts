import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { buscarPerfil } from '@/http/buscar-perfil'

export async function usuarioEstaAutenticado() {
  return !!(await cookies()).get('agendador-token')?.value
}

export async function usuarioAdminEstaAutenticado() {
  return !!(await cookies()).get('ag-tk-admin')?.value
}

export async function getSlugOrganizacaoAtual() {
  return (await cookies()).get('agendador-organizacao')?.value
}

export async function authAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('ag-tk-admin')?.value

    if (!token) {
      redirect('/painel/auth/sign-in')
    }

    const { usuario } = await buscarPerfil()

    return usuario
  } catch {}

  redirect('/painel/api/auth/sign-out')
}
