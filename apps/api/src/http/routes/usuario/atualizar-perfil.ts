import { usuarioSchema } from '@agendamento-saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function AtualizarPerfil(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizacao/:slug/perfil',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Atualiza o perfil do usuário autenticado',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            nome: z.string(),
            email: z.string().email().optional(),
            numeroCelular: z.string(),
            avatarUrl: z.string().url().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { nome, numeroCelular, avatarUrl, email } = request.body

        const usuarioLogadoId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(
          usuarioLogadoId,
          membership.role,
        )

        const authUsuario = usuarioSchema.parse({
          id: usuarioLogadoId,
          role: membership.role,
        })

        if (cannot('update', authUsuario)) {
          throw new UnauthorizedError(
            'Você não possui permissões para atualizar este perfil.',
          )
        }

        await prisma.usuario.update({
          data: {
            nome,
            email,
            numeroCelular,
            avatarUrl,
          },
          where: {
            id: usuarioLogadoId,
          },
        })

        return reply.status(204).send()
      },
    )
}
