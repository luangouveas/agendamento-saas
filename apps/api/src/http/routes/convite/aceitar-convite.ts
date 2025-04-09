import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function AceitarConvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/convite/:id/aceitar',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Aceita um convite de associação para um estabelecimento.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            nome: z.string(),
            numeroCelular: z.string(),
            dataNascimento: z.string(),
            passwordHash: z.string(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const { nome, numeroCelular, dataNascimento, passwordHash } =
          request.body

        const convite = await prisma.convite.findUnique({
          where: {
            id,
          },
        })

        if (!convite) {
          throw new BadRequestError('O convite não está mais válido.')
        }

        const usuarioComEmail = await prisma.usuario.findFirst({
          where: {
            OR: [{ numeroCelular }, { email: convite.email }],
          },
        })

        if (usuarioComEmail) {
          throw new BadRequestError(
            'Já existe um usuário com este e-mail e/ou número de telefone.',
          )
        }

        const usuario = await prisma.usuario.create({
          data: {
            nome,
            numeroCelular,
            dataNascimento,
            email: convite.email,
            passwordHash,
          },
        })

        await prisma.$transaction([
          prisma.membro.create({
            data: {
              role: convite.role,
              tipo: 'FUNCIONARIO',
              usuarioId: usuario.id,
              organizacaoId: convite.organizacaoId,
            },
          }),

          prisma.convite.delete({
            where: {
              id: convite.id,
            },
          }),
        ])

        return reply.status(201).send()
      },
    )
}
