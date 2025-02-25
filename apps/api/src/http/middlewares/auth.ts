import { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Token inválido')
      }
    }

    request.getUserMembership = async (slug: string) => {
      const usuarioId = await request.getCurrentUserId()

      const membro = await prisma.membro.findFirst({
        where: {
          usuarioId,
          organizacao: {
            slug,
          },
        },
        include: {
          organizacao: true,
        },
      })

      if (!membro) {
        throw new UnauthorizedError('Você não faz parte deste estabelecimento')
      }

      const { organizacao, ...membership } = membro

      return {
        organizacao,
        membership,
      }
    }
  })
})
