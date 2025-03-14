import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarServico(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/servico/:servicoId',
      {
        schema: {
          tags: ['Serviço'],
          summary: 'Busca os dados de um serviço',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            servicoId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              servico: z.object({
                id: z.string().uuid(),
                nome: z.string(),
                organizacaoId: z.string(),
                descricao: z.string(),
                tempo: z.number(),
                valor: z.number(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, servicoId } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', 'Servico')) {
          throw new UnauthorizedError(
            'Você não possui permissões para buscar serviços nesta organização.',
          )
        }

        const servico = await prisma.servico.findUnique({
          where: {
            id: servicoId,
            organizacaoId: organizacao.id,
          },
        })

        if (!servico) {
          throw new BadRequestError('Serviço não encontrado.')
        }

        return { servico }
      },
    )
}
