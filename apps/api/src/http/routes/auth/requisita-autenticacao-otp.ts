import { randomInt } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function requisitaAutenticacaoComOTP(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/request-otp',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Requisita autenticação de cliente via OTP',
        body: z.object({
          telefone: z.number(),
        }),
        response: {
          201: z.object({
            tokenOtp: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { telefone } = request.body

      const usuarioBytelefone = await prisma.usuario.findUnique({
        where: {
          numeroCelular: telefone,
        },
      })

      if (!usuarioBytelefone) {
        throw new BadRequestError('Usuário não existe com este telefone')
      }

      const tokenOtp = randomInt(100000, 999999).toString()

      // salvar relação token vs usuario no banco

      // enviar token via wpp
      console.log({ tokenOtp })

      reply.status(201).send({ tokenOtp })
    },
  )
}
