import { Role } from '@agendamento-saas/auth'
import { AppAbility } from '@agendamento-saas/auth/src/criar-app-ability'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { BuscarAfiliacao } from '@/http/buscar-afiliacao'
import { buscarPerfil } from '@/http/buscar-perfil'
import { buscarPermissoesUsuario } from '@/lib/utils'

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

export async function getAfiliacaoAtual() {
  const slug = await getSlugOrganizacaoAtual()

  if (!slug) {
    return null
  }

  const { afiliacao } = await BuscarAfiliacao(slug)

  return afiliacao
}

export async function ability() {
  const afiliacao = await getAfiliacaoAtual()

  if (!afiliacao) {
    return null
  }

  const ability = buscarPermissoesUsuario(afiliacao.usuarioId, afiliacao.role)

  return { ability, role: afiliacao.role }
}
