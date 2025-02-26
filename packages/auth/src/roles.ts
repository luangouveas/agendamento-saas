import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('ADMIN'),
  z.literal('ATENDENTE'),
  z.literal('CLIENTE'),
  z.literal('FINANCEIRO'),
  z.literal('RECEPCIONISTA'),
])

export type Role = z.infer<typeof roleSchema>
