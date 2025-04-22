import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function CriarExpediente(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizacao/:slug/expediente',
      {
        schema: {
          tags: ['Expediente'],
          summary: 'Cria um expediente para um profissional.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            membroId: z.string().uuid(),
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
            201: z.object({
              expedienteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { nome, diasExpediente, membroId } = request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('create', 'Expediente')) {
          throw new UnauthorizedError(
            'Você não tem permissões para criar um expediente.',
          )
        }

        const expedientePrincipal = await prisma.expediente.findFirst({
          where: {
            membroId,
            expedientePrincipal: true,
          },
        })

        const { id: expedienteId } = await prisma.expediente.create({
          data: {
            nome,
            membroId,
            expedientePrincipal: !expedientePrincipal,
            diasExpediente: {
              createMany: {
                data: diasExpediente,
              },
            },
          },
        })

        return reply.status(201).send({ expedienteId })
      },
    )
}
