import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarServicos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/servicos',
      {
        schema: {
          tags: ['Serviço'],
          summary: 'Busca a lista de serviços de uma organização',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              servicos: z.array(
                z.object({
                  id: z.string().uuid(),
                  nome: z.string(),
                  organizacaoId: z.string(),
                  descricao: z.string(),
                  tempo: z.number(),
                  valor: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('get', 'Servico')) {
          throw new UnauthorizedError(
            'Você não possui permissões para buscar serviços nesta organização.',
          )
        }

        const servicos = await prisma.servico.findMany({
          where: {
            organizacaoId: organizacao.id,
          },
          orderBy: {
            nome: 'asc',
          },
        })

        return { servicos }
      },
    )
}
