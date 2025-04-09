import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function BuscarUsuarioPorEmail(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/usuario/:email',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Busca os dados de um usuário por email para associação.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            email: z.string().email(),
          }),
          response: {
            200: z.object({
              usuario: z
                .object({
                  id: z.string().uuid(),
                  avatarUrl: z.string().nullable(),
                  nome: z.string(),
                })
                .nullable(),
            }),
          },
        },
      },
      async (request) => {
        const { email, slug } = request.params
        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('create', 'Convite')) {
          throw new UnauthorizedError(
            'Você não tem permissões para criar associações de outros usuários com esta organização.',
          )
        }

        const usuario = await prisma.usuario.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            avatarUrl: true,
            nome: true,
          },
        })

        return { usuario }
      },
    )
}
