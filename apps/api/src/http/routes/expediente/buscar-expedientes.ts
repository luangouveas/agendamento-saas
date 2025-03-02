import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarExpedientes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/expedientes',
      {
        schema: {
          tags: ['Expediente'],
          summary: 'Busca a lista de expedientes de um profissional',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              expedientes: z
                .array(
                  z.object({
                    id: z.string(),
                    nome: z.string(),
                    expedientePrincipal: z.boolean(),
                  }),
                )
                .nullable(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', 'Expediente')) {
          throw new UnauthorizedError(
            'Você não possui permissão para visualizar este expediente.',
          )
        }

        const expedientes = await prisma.expediente.findMany({
          select: {
            id: true,
            nome: true,
            expedientePrincipal: true,
          },
          where: {
            membroId: membership.id,
          },
        })

        return { expedientes }
      },
    )
}
