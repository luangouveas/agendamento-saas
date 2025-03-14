import { z } from 'zod'

import { usuarioSchema } from '../models/usuario'

export const usuarioSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
  ]),
  z.union([z.literal('Usuario'), usuarioSchema]),
])

export type UsuarioSubject = z.infer<typeof usuarioSubject>
