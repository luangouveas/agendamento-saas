import { randomInt } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

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

      await prisma.token.create({
        data: {
          tipo: 'OTP_ACCESS',
          otpNumber: tokenOtp,
          usuarioId: usuarioBytelefone.id,
        },
      })

      // enviar token via wpp
      console.log(`Olá este é seu código de verificação de acesso: ${tokenOtp}`)

      return reply.status(201).send()
    },
  )
}
