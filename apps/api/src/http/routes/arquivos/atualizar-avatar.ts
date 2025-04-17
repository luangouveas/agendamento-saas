import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function AtualizarAvatar(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/arquivos/atualizar-avatar',
      {
        schema: {
          tags: ['Arquivos'],
          summary: 'Salva a URL do avatar.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            id: z.string(),
            tipo: z.union([
              z.literal('estabelecimentos'),
              z.literal('usuarios'),
              z.literal('servicos'),
            ]),
            avatarUrl: z.string().url(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { avatarUrl, id, tipo } = request.body

        switch (tipo) {
          case 'estabelecimentos':
            await prisma.organizacao.update({
              data: {
                avatarUrl,
              },
              where: {
                id,
              },
            })
            break
          case 'servicos':
            await prisma.servico.update({
              data: {
                avatarUrl,
              },
              where: {
                id,
              },
            })
            break
          case 'usuarios':
            await prisma.usuario.update({
              data: {
                avatarUrl,
              },
              where: {
                id,
              },
            })
            break
          default:
            break
        }

        return reply.status(204).send()
      },
    )
}
