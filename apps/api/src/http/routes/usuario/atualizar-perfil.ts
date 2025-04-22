import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export function AtualizarPerfil(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/perfil',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Atualiza o perfil do usuário autenticado',
          security: [{ bearerAuth: [] }],
          body: z.object({
            nome: z.string(),
            email: z.string().email().optional(),
            numeroCelular: z.string(),
            dataNascimento: z
              .string()
              .date()
              .transform((v) => new Date(v)),
            cep: z.string().optional(),
            rua: z.string().optional(),
            bairro: z.string().optional(),
            cidade: z.string().optional(),
            estado: z.string().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const {
          nome,
          numeroCelular,
          email,
          bairro,
          cep,
          cidade,
          estado,
          rua,
          dataNascimento,
        } = request.body

        const usuarioLogadoId = await request.getCurrentUserId()

        const usuarioComMesmoTelefone = await prisma.usuario.findFirst({
          where: {
            numeroCelular,
            NOT: {
              id: usuarioLogadoId,
            },
          },
        })

        if (usuarioComMesmoTelefone) {
          throw new BadRequestError('Este número de telefone já está em uso.')
        }

        const usuarioComMesmoEmail = await prisma.usuario.findFirst({
          where: {
            email,
            NOT: {
              id: usuarioLogadoId,
            },
          },
        })

        if (usuarioComMesmoEmail) {
          throw new BadRequestError('Este e-mail já está em uso.')
        }

        await prisma.usuario.update({
          data: {
            nome,
            email,
            numeroCelular,
            cep,
            cidade,
            estado,
            rua,
            bairro,
            dataNascimento,
          },
          where: {
            id: usuarioLogadoId,
          },
        })

        return reply.status(204).send()
      },
    )
}
