import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function InativarServico(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizacao/:slug/servico/:servicoId/inativar',
      {
        schema: {
          tags: ['Serviço'],
          summary: 'Inativa um serviço',
          security: [{ bearerAuth: [] }],
          params: z.object({
            servicoId: z.string().uuid(),
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, servicoId } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('update', 'Servico')) {
          throw new UnauthorizedError(
            'Você não possui permissões para atualizar serviços nesta organização.',
          )
        }

        const servicoById = await prisma.servico.findUnique({
          where: {
            id: servicoId,
            organizacaoId: organizacao.id,
          },
        })

        if (!servicoById) {
          throw new BadRequestError('Esse serviço não existe.')
        }

        await prisma.servico.update({
          where: {
            id: servicoId,
            organizacaoId: organizacao.id,
          },
          data: {
            ativo: false,
          },
        })

        return reply.status(204).send()
      },
    )
}
