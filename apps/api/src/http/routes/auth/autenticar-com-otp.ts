import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AutenticarComOtp(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/otp',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Realiza autenticação via OTP',
        body: z.object({
          telefone: z.number(),
          tokenOtp: z.number(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { telefone, tokenOtp } = request.body

      const usuarioBytelefone = await prisma.usuario.findUnique({
        where: {
          numeroCelular: telefone,
        },
      })

      if (!usuarioBytelefone) {
        throw new BadRequestError('Usuário não existe com este telefone.')
      }

      const tokenByUsuarioToken = await prisma.token.findFirst({
        where: {
          usuarioId: usuarioBytelefone.id,
          otpNumber: tokenOtp,
        },
      })

      if (!tokenByUsuarioToken) {
        throw new UnauthorizedError('Código de acesso inválido.')
      }

      await prisma.token.delete({
        where: {
          id: tokenByUsuarioToken.id,
        },
      })

      const token = await reply.jwtSign(
        {
          sub: usuarioBytelefone.id,
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
