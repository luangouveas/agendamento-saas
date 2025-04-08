import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
