import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function MarcarExpedientePrincipal(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizacao/:slug/membro/:membroId/expediente/:expedienteId',
      {
        schema: {
          tags: ['Expediente'],
          summary: 'Marca o expediente de um profissional como principal.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            membroId: z.string().uuid(),
            expedienteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, expedienteId, membroId } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('marcar_principal', 'Expediente')) {
          throw new UnauthorizedError(
            'Você não tem permissão para marcar este expediente como principal.',
          )
        }

        const expedientePrincipalAtual = await prisma.expediente.findFirst({
          where: {
            membroId,
            expedientePrincipal: true,
          },
        })

        if (!expedientePrincipalAtual) {
          throw new BadRequestError(
            'Não foi possivel localizar o expediente principal atual.',
          )
        }

        await prisma.$transaction([
          prisma.expediente.update({
            where: {
              id: expedientePrincipalAtual.id,
            },
            data: {
              expedientePrincipal: false,
            },
          }),

          prisma.expediente.update({
            where: {
              id: expedienteId,
            },
            data: {
              expedientePrincipal: true,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
