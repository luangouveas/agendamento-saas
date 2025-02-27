import { roleSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarMembros(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/membros',
      {
        schema: {
          tags: ['Organizações'],
          summary: 'Busca a lista de membros da organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membros: z.array(
                z.object({
                  usuarioId: z.string().uuid(),
                  id: z.string().uuid(),
                  role: roleSchema,
                  tipo: z.union([
                    z.literal('CLIENTE'),
                    z.literal('FUNCIONARIO'),
                  ]),
                  nome: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  numeroCelular: z.bigint(),
                  email: z.string().email().nullable(),
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

        if (cannot('get', 'Usuario')) {
          throw new UnauthorizedError(
            'Você náo possui permissções para consulta de membros desta organização.',
          )
        }

        const membros = await prisma.membro.findMany({
          select: {
            id: true,
            role: true,
            tipo: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                numeroCelular: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizacaoId: organizacao.id,
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membrosByRole = membros.map(
          ({ usuario: { id: usuarioId, ...usuario }, ...membro }) => {
            return {
              ...usuario,
              ...membro,
              usuarioId,
            }
          },
        )

        return { membros: membrosByRole }
      },
    )
}
