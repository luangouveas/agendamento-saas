import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function BuscarProfissional(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/profissional/:membroProfissionalId',
      {
        schema: {
          tags: ['Profissionais'],
          summary: 'Busca os dados de um profissional',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            membroProfissionalId: z.string(),
          }),
          response: {
            200: z.object({
              profissional: z.object({
                id: z.string().uuid(),
                membroId: z.string().uuid(),
                nome: z.string(),
                rua: z.string().nullable(),
                bairro: z.string().nullable(),
                cidade: z.string().nullable(),
                estado: z.string().nullable(),
                cep: z.string().nullable(),
                avatarUrl: z.string().url().nullable(),
                createdAt: z.date(),
                dataNascimento: z.date().nullable(),
                numeroCelular: z.string(),
                email: z.string().email().nullable(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, membroProfissionalId } = request.params
        const usuarioLogadoId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(
          usuarioLogadoId,
          membership.role,
        )

        if (cannot('get', 'Usuario')) {
          throw new UnauthorizedError(
            'Você não possui permissão para buscar dados do profissional',
          )
        }

        const membroProfissional = await prisma.membro.findUnique({
          where: {
            id: membroProfissionalId,
            organizacaoId: organizacao.id,
            role: 'ATENDENTE',
            tipo: 'FUNCIONARIO',
          },
          select: {
            id: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                dataNascimento: true,
                email: true,
                createdAt: true,
                numeroCelular: true,
                rua: true,
                cep: true,
                cidade: true,
                bairro: true,
                estado: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (!membroProfissional) {
          throw new BadRequestError(
            'Não foi possível localizar o registro do profissional.',
          )
        }

        const {
          usuario: { id: usuarioId, ...usuario },
          ...membro
        } = membroProfissional

        const profissional = {
          id: usuarioId,
          membroId: membro.id,
          ...usuario,
        }

        return {
          profissional,
        }
      },
    )
}
