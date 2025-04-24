import { defineAbilityFor, Role, usuarioSchema } from '@agendamento-saas/auth'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function buscarPermissoesUsuario(userId: string, role: Role) {
  const authUser = usuarioSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mascarasTelefone = ['(99) 9999-9999', '(99) 99999-9999']

export const formatarValorParaMoeda = (valor: string | null): string => {
  if (!valor) return ''
  const valorStr = valor.toString().padStart(3, '0') // garante pelo menos 3 dígitos
  const reais = valorStr.slice(0, -2)
  const centavos = valorStr.slice(-2)
  return `${reais},${centavos}`
}

export const converterMinutosEmTempo = (tempoMinutos: number) => {
  const horas = Math.floor(tempoMinutos / 60)
  const minutos = Math.floor(tempoMinutos % 60)
  const tempo = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`

  return tempo
}
