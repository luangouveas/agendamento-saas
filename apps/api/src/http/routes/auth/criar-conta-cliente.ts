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
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const organizacao = await prisma.organizacao.findUnique({
        where: {
          slug,
        },
      })

      if (!organizacao) {
        throw new BadRequestError('Organização não localizada.')
      }

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

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          numeroCelular,
          email,
          membros: {
            create: {
              role: 'CLIENTE',
              tipo: 'CLIENTE',
              organizacaoId: organizacao.id,
            },
          },
        },
      })

      const token = await reply.jwtSign(
        {
          sub: usuario.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
