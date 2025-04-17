import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export function BuscarAssinaturaUsuarioPorIdUsuario(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/assinatura',
      {
        schema: {
          tags: ['Assinatura'],
          summary: 'Busca os dados da assinatura do usuário',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              assinatura: z.object({
                id: z.string().uuid(),
                email: z.string().nullable(),
                stripeCustomerId: z.string().nullable(),
                stripeSubscriptionId: z.string().nullable(),
                stripeSubscriptionStatus: z.string().nullable(),
                stripePriceId: z.string().nullable(),
                totalEstabelecimentos: z.number(),
                totalServicos: z.number(),
                totalProfissionais: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()

        const assinaturaUsuario = await prisma.usuario.findUnique({
          where: {
            id: usuarioId,
          },
          select: {
            id: true,
            email: true,
            stripePriceId: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripeSubscriptionStatus: true,
          },
        })

        if (!assinaturaUsuario) {
          throw new BadRequestError('Usuário não encontrado')
        }

        const countEstabelecimentos = await prisma.organizacao.count({
          where: {
            ownerId: usuarioId,
          },
        })

        const countServicos = await prisma.servico.count({
          where: {
            ativo: true,
            organizacao: {
              ownerId: usuarioId,
            },
          },
        })

        const countProfissionais = await prisma.membro.count({
          where: {
            organizacao: {
              ownerId: usuarioId,
            },
            AND: {
              tipo: 'FUNCIONARIO',
              NOT: {
                usuarioId,
              },
            },
          },
        })

        const assinatura = {
          ...assinaturaUsuario,
          totalEstabelecimentos: countEstabelecimentos,
          totalServicos: countServicos,
          totalProfissionais: countProfissionais,
        }

        return { assinatura }
      },
    )
}
