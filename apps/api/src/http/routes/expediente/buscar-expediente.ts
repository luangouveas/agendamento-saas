import { expedienteSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarExpediente(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/expediente/:expedienteId',
      {
        schema: {
          tags: ['Expediente'],
          summary: 'Busca os dados de um expediente',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            expedienteId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              expediente: z.object({
                id: z.string(),
                nome: z.string(),
                expedientePrincipal: z.boolean(),
                diasExpediente: z.array(
                  z.object({
                    id: z.string(),
                    diaSemana: z.number(),
                    inicio: z.string(),
                    fim: z.string(),
                    inicioIntervalo: z.string().nullable(),
                    fimIntervalo: z.string().nullable(),
                  }),
                ),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { expedienteId, slug } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        const authExpediente = expedienteSchema.parse({
          membroId: membership.id,
          usuarioId,
        })

        if (cannot('get', authExpediente)) {
          throw new UnauthorizedError(
            'Você não possui permissão para visualizar este expediente.',
          )
        }

        const expediente = await prisma.expediente.findUnique({
          select: {
            id: true,
            nome: true,
            expedientePrincipal: true,
            diasExpediente: {
              select: {
                id: true,
                diaSemana: true,
                inicio: true,
                fim: true,
                inicioIntervalo: true,
                fimIntervalo: true,
              },
            },
          },
          where: {
            id: expedienteId,
          },
        })

        if (!expediente) {
          throw new BadRequestError('Expediente não encontrado.')
        }

        return { expediente }
      },
    )
}
