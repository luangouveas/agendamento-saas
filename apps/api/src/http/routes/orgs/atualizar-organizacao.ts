import { organizacaoSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AtualizarOrganizacao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizacao',
      {
        schema: {
          tags: ['Organizacoes'],
          summary: 'Atualiza os dados de uma organização',
          body: z.object({
            cnpj: z.string().min(14).max(14),
            razaoSocial: z.string(),
            nome: z.string(),
            cep: z.string(),
            rua: z.string(),
            bairro: z.string(),
            cidade: z.string(),
            estado: z.string().min(2).max(2),
          }),
          params: z.object({
            slug: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { bairro, cep, cidade, cnpj, estado, nome, razaoSocial, rua } =
          request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const authOrganizacao = organizacaoSchema.parse(organizacao)
        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('update', authOrganizacao)) {
          throw new UnauthorizedError(
            'Usuário não autorizado a realizar alterações nesta organização',
          )
        }

        await prisma.organizacao.update({
          where: {
            id: organizacao.id,
          },
          data: {
            bairro,
            cep,
            cidade,
            cnpj,
            estado,
            nome,
            razaoSocial,
            rua,
          },
        })

        return reply.status(204).send()
      },
    )
}
