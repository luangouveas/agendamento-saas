import { z } from 'zod'

export const usuarioSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('update')]),
  z.literal('Usuario'),
])

export type UsuarioSubject = z.infer<typeof usuarioSubject>
