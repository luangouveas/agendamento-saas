import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export function BuscarPerfil(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/perfil',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Busca o perfil do usuário autenticado.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              usuario: z.object({
                id: z.string().uuid(),
                nome: z.string(),
                dataNascimento: z.date().nullable(),
                email: z.string().email().nullable(),
                numeroCelular: z.bigint(),
                avatarUrl: z.string().url().nullable(),
                cep: z.string().nullable(),
                rua: z.string().nullable(),
                bairro: z.string().nullable(),
                cidade: z.string().nullable(),
                estado: z.string().nullable(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()

        const usuario = await prisma.usuario.findUnique({
          select: {
            id: true,
            nome: true,
            dataNascimento: true,
            email: true,
            numeroCelular: true,
            avatarUrl: true,
            cep: true,
            rua: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
          where: {
            id: usuarioId,
          },
        })

        if (!usuario) {
          throw new BadRequestError('Usuário não encontrado.')
        }

        return { usuario }
      },
    )
}
