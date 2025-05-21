import { randomInt } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { WhatsappApi } from '@/lib/wpp-api'

export async function requisitaAutenticacaoComOTP(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/request-otp',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Requisita autenticação de cliente via OTP',
        body: z.object({
          telefone: z.string(),
        }),
        response: {
          201: z.object({
            tokenOtp: z.number(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { telefone } = request.body

      let usuarioBytelefone = await prisma.usuario.findUnique({
        where: {
          numeroCelular: telefone,
        },
      })

      if (!usuarioBytelefone) {
        //   throw new BadRequestError('Usuário não existe com este telefone')
        usuarioBytelefone = await prisma.usuario.create({
          data: {
            nome: '',
            numeroCelular: telefone,
          },
        })
      }

      const tokenOtp = randomInt(100000, 999999)

      await prisma.token.deleteMany({
        where: {
          tipo: 'OTP_ACCESS',
          usuarioId: usuarioBytelefone.id,
        },
      })

      await prisma.token.create({
        data: {
          tipo: 'OTP_ACCESS',
          otpNumber: tokenOtp,
          usuarioId: usuarioBytelefone.id,
        },
      })

      const message = `Olá este é seu código de verificação de acesso: ${tokenOtp}`

      await WhatsappApi.sendMessage({
        phone: telefone.replace('+', '').replace(' ', ''),
        message,
      })

      return reply.status(201).send()
    },
  )
}
