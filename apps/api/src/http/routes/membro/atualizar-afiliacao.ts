import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AtualizarAfiliacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizacao/:slug/membro/:membroId',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Atualiza a afiliação de um usuário em uma organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            membroId: z.string().uuid(),
          }),
          body: z.object({
            tipo: z.union([z.literal('CLIENTE'), z.literal('FUNCIONARIO')]),
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, membroId } = request.params
        const { role, tipo } = request.body

        const usuarioLogadoId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(
          usuarioLogadoId,
          membership.role,
        )

        if (cannot('update', 'Membro')) {
          throw new UnauthorizedError(
            'Você não possui permissão para atualizar membros deste estabelecimento.',
          )
        }

        await prisma.membro.update({
          data: {
            role,
            tipo,
          },
          where: {
            id: membroId,
            organizacaoId: organizacao.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
