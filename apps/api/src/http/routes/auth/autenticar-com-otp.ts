import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AutenticarComOtp(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/:slug/auth/otp',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Realiza autenticação via OTP',
        body: z.object({
          telefone: z.string(),
          tokenOtp: z.number(),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      console.log('chegou aqui')
      const { telefone, tokenOtp } = request.body
      const { slug } = request.params

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

      const org = await prisma.organizacao.findUnique({
        where: {
          slug,
        },
      })

      const membro = await prisma.membro.findFirst({
        where: {
          usuarioId: usuarioBytelefone.id,
          organizacaoId: org!.id,
        },
      })

      if (!membro) {
        await prisma.membro.create({
          data: {
            usuarioId: usuarioBytelefone.id,
            organizacaoId: org!.id,
            tipo: 'CLIENTE',
            role: 'CLIENTE',
          },
        })
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
