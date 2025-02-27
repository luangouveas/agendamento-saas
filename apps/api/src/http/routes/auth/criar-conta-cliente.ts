import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export function CriarContaUsuarioCliente(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/usuario/cliente',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Cria uma conta de usuário cliente',
        body: z.object({
          nome: z.string(),
          numeroCelular: z.number(),
          email: z.string().optional().nullable(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { nome, numeroCelular, email } = request.body

      const usuarioByTelefone = await prisma.usuario.findUnique({
        where: {
          numeroCelular,
        },
      })

      if (usuarioByTelefone) {
        throw new BadRequestError(
          'Já existe um acesso criado com este telefone.',
        )
      }

      await prisma.usuario.create({
        data: {
          nome,
          numeroCelular,
          email,
        },
      })

      return reply.status(201).send()
    },
  )
}
