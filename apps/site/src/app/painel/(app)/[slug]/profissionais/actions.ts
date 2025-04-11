'use server'

import { Role } from '@agendamento-saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { AtualizarAfiliacao } from '@/http/atualiza-afiliacao'
import { BuscarUsuarioPorEmail } from '@/http/buscar-usuario-por-email'
import { CriarAfiliacaoUsuarioEmpresa } from '@/http/criar-afiliacao'
import { CriarConvite } from '@/http/criar-convite'

export async function atualizarRoleMembroAction(membroId: string, role: Role) {
  const slug = await getSlugOrganizacaoAtual()

  try {
    await AtualizarAfiliacao({
      slug: slug!,
      membroId,
      role,
      tipo: 'FUNCIONARIO',
    })

    revalidateTag(`${slug}/membros`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado! Tente novamente em instantes.',
    }
  }

  return {
    success: true,
    message: 'Credencial do profissional atualizado com sucesso.',
  }
}

export async function removerMembroAction(membroId: string) {}
export async function cancelarConviteAction(conviteId: string) {}

export async function BuscarUsuarioPorEmailAction(email: string) {
  const slug = await getSlugOrganizacaoAtual()

  const zEmail = z.string().email()
  const resultParse = zEmail.safeParse(email)

  if (!resultParse.success) {
    return {
      success: false,
      message: 'Insira um email válido',
      usuario: null,
    }
  }

  try {
    const { usuario } = await BuscarUsuarioPorEmail({ slug: slug!, email })

    if (usuario) {
      return {
        success: true,
        message: null,
        usuario,
      }
    }

    return {
      success: true,
      message: 'O usuário não está cadastrado na plataforma',
      usuario: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        usuario: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado! Tente novamente em instantes.',
      usuario: null,
    }
  }
}

export async function AssociarUsuarioExistenteAction(
  usuarioId: string,
  role: string,
) {
  const slug = await getSlugOrganizacaoAtual()

  try {
    await CriarAfiliacaoUsuarioEmpresa({
      slug: slug!,
      usuarioId,
      role,
      tipo: 'FUNCIONARIO',
    })
    revalidateTag(`${slug}/membros`)
    revalidateTag(`${slug}/convites-pendentes`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado! Tente novamente em instantes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Usuário associado com sucesso!',
    errors: null,
  }
}

export async function ConvidarNovoUsuarioAction(email: string, role: string) {
  const slug = await getSlugOrganizacaoAtual()

  try {
    await CriarConvite({ slug: slug!, email, role })
    revalidateTag(`${slug}/convites-pendentes`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado! Tente novamente em instantes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Usuário convidado com sucesso.',
    errors: null,
  }
}
