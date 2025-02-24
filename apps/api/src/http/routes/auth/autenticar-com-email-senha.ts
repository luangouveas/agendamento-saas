import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function autenticarComEmailSenha(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/email-senha',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Autentica o usuário com email e senha',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const usuarioByEmail = await prisma.usuario.findUnique({
        where: {
          email,
        },
      })

      if (!usuarioByEmail) {
        throw new UnauthorizedError('Credenciais inválidas')
      }

      if (usuarioByEmail.passwordHash == null) {
        throw new UnauthorizedError('Credenciais inválidas')
      }

      const senhaEhValida = await compare(password, usuarioByEmail.passwordHash)

      if (!senhaEhValida) {
        throw new UnauthorizedError('Credenciais inválidas')
      }

      const token = await reply.jwtSign(
        {
          sub: usuarioByEmail.id,
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
