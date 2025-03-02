import { expedienteSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AtualizarExpediente(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizacao/:slug/expediente/:expedienteId',
      {
        schema: {
          tags: ['Expediente'],
          summary: 'Atualiza o expediente de um profissional.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            expedienteId: z.string().uuid(),
          }),
          body: z.object({
            nome: z.string(),
            diasExpediente: z.array(
              z.object({
                diaSemana: z.number().min(1).max(7),
                inicio: z.string(),
                fim: z.string(),
                inicioIntervalo: z.string().optional(),
                fimIntervalo: z.string().optional(),
              }),
            ),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, expedienteId } = request.params
        const { nome, diasExpediente } = request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        const authExpediente = expedienteSchema.parse({
          usuarioId,
          membroId: membership.id,
        })

        if (!cannot('update', authExpediente)) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar este expediente.',
          )
        }

        const expedienteAtual = await prisma.expediente.findFirst({
          where: {
            id: expedienteId,
          },
        })

        await prisma.$transaction([
          prisma.diasExpediente.deleteMany({
            where: {
              expedienteId,
            },
          }),

          prisma.expediente.update({
            where: {
              id: expedienteId,
            },
            data: {
              nome,
              membroId: membership.id,
              expedientePrincipal: expedienteAtual!.expedientePrincipal,
              diasExpediente: {
                createMany: {
                  data: diasExpediente,
                },
              },
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
