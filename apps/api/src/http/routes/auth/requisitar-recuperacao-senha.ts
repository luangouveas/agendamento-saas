import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function RequisitarRecuperacaoSenha(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Requisita a recuperação de senha',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const usuarioByEmail = await prisma.usuario.findUnique({
        where: { email },
      })

      if (!usuarioByEmail) {
        return reply.status(201).send()
      }

      const { id: code } = await prisma.token.create({
        data: {
          tipo: 'PASSORD_RECOVER',
          usuarioId: usuarioByEmail.id,
        },
      })

      // Enviar link para recuperação de senha por email
      console.log('Código para recuperação de senha: ', code)

      return reply.status(201).send()
    },
  )
}
