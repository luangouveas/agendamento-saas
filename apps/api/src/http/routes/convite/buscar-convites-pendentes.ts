import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function BuscarConvitesPendentes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/convites-pendentes',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Busca todos os convites pendentes de uma organização.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              convites: z.array(
                z.object({
                  id: z.string().uuid(),
                  createdAt: z.date(),
                  role: roleSchema,
                  email: z.string().email(),
                  autor: z
                    .object({
                      nome: z.string(),
                      avatarUrl: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const usuarioId = await request.getCurrentUserId()
        const { organizacao, membership } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', 'Convite')) {
          throw new UnauthorizedError(
            'O usuário não possui permissão para visualizar os convites deste estabelecimento.',
          )
        }

        const convites = await prisma.convite.findMany({
          where: {
            organizacaoId: organizacao.id,
          },
          select: {
            role: true,
            id: true,
            email: true,
            createdAt: true,
            autor: {
              select: {
                avatarUrl: true,
                nome: true,
              },
            },
          },
        })

        return { convites }
      },
    )
}
