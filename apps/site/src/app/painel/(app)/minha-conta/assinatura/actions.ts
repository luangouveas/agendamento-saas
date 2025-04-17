'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { BuscarAssinaturaUsuarioPorIdUsuario } from '@/http/assinatura'
import * as stripeService from '@/services/stripe'
import { config } from '@/services/stripe/config'

export async function atualizarAssinaturaPROAction(email: string) {
  try {
    await stripeService.atualizarAssinaturaUsuario(email)

    return {
      success: true,
      message: 'Assinatura atualizada com sucesso!',
    }
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
      message: err.message,
    }
  }
}

export async function atualizarAssinaturaFREEAction() {
  try {
    const { assinatura } = await BuscarAssinaturaUsuarioPorIdUsuario()

    const {
      estabelecimentos: maxEstabelecimentos,
      profissionais: maxProfissionais,
      servicos: maxServicos,
    } = config.stripe.plans.free.quota

    if (assinatura.totalEstabelecimentos > maxEstabelecimentos) {
      return {
        success: false,
        message: `Você não pode voltar ao plano FREE pois possui mais de ${maxEstabelecimentos} estabelecimentos ativos.`,
        errors: null,
      }
    }

    if (assinatura.totalProfissionais > maxProfissionais) {
      return {
        success: false,
        message: `Você não pode voltar ao plano FREE pois possui mais de ${maxProfissionais} profissionais ativos.`,
        errors: null,
      }
    }

    if (assinatura.totalServicos > maxServicos) {
      return {
        success: false,
        message: `Você não pode voltar ao plano FREE pois possui mais de ${maxServicos} serviços ativos.`,
        errors: null,
      }
    }

    await stripeService.cancelarAssinaturaUsuarioByEmail(assinatura.email)

    revalidateTag('assinatura-usuario')
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
      message: 'Houve um erro inesperado ao tentar atualizar a sua assinatura.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Sua assinatura foi cancelada com sucesso!',
    errors: null,
  }
}
