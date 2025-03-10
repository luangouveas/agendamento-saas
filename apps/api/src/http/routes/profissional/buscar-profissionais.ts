import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export function BuscarProfissionais(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizacao/:slug/profissionais',
      {
        schema: {
          tags: ['Profissionais'],
          summary: 'Busca a lista de profissionais de um estabeleciemnto',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              profissionais: z
                .array(
                  z.object({
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
                )
                .nullable(),
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

        if (cannot('get', 'Usuario')) {
          throw new UnauthorizedError(
            'Você não possui permissão para buscar profissionais',
          )
        }

        const membrosProfissionais = await prisma.membro.findMany({
          where: {
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

        if (!membrosProfissionais) {
          throw new BadRequestError('Nenhum profissional encontrado.')
        }

        const profissionais = membrosProfissionais.map(
          ({ usuario: { id: usuarioId, ...usuario }, ...membro }) => {
            return {
              id: usuarioId,
              membroId: membro.id,
              nome: usuario.nome,
              rua: usuario.rua,
              bairro: usuario.bairro,
              cidade: usuario.cidade,
              estado: usuario.estado,
              cep: usuario.cep,
              avatarUrl: usuario.avatarUrl,
              createdAt: usuario.createdAt,
              dataNascimento: usuario.dataNascimento,
              numeroCelular: usuario.numeroCelular,
              email: usuario.email,
            }
          },
        )

        return { profissionais }
      },
    )
}
