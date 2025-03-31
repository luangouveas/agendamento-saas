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
                rua: z.string().nullable(),
                bairro: z.string().nullable(),
                cidade: z.string().nullable(),
                estado: z.string().nullable(),
                cep: z.string().nullable(),
                avatarUrl: z.string().url().nullable(),
                dataNascimento: z.date().nullable(),
                email: z.string().email().nullable(),
                ddi: z.string(),
                numeroCelular: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()

        const usuarioBanco = await prisma.usuario.findUnique({
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

        if (!usuarioBanco) {
          throw new BadRequestError('Usuário não encontrado.')
        }

        const [ddi, numeroSemDDI] = usuarioBanco.numeroCelular.split(' ')

        const usuario = {
          ddi,
          numeroCelular: numeroSemDDI,
          id: usuarioBanco.id,
          nome: usuarioBanco.nome,
          dataNascimento: usuarioBanco.dataNascimento,
          email: usuarioBanco.email,
          avatarUrl: usuarioBanco.avatarUrl,
          cep: usuarioBanco.cep,
          rua: usuarioBanco.rua,
          bairro: usuarioBanco.bairro,
          cidade: usuarioBanco.cidade,
          estado: usuarioBanco.estado,
        }

        return { usuario }
      },
    )
}
