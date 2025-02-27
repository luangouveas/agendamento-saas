import { roleSchema } from '@agendamento-saas/auth'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { buscarPermissoesUsuario } from '@/utils/buscar-permissoes-usuario'
import { gerarSenhaAleatoria } from '@/utils/gerar-senha-aleatoria'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export function CriarContaUsuario(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/usuario',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Cria uma conta de usuário',
          security: [{ bearerAuth: [] }],
          body: z.object({
            nome: z.string(),
            rua: z.string().optional().nullable(),
            bairro: z.string().optional().nullable(),
            cidade: z.string().optional().nullable(),
            estado: z.string().optional().nullable(),
            cep: z.string().optional().nullable(),
            dataNascimento: z.date(),
            numeroCelular: z.number(),
            email: z.string().optional().nullable(),
            avatarUrl: z.string().optional().nullable(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const {
          nome,
          rua,
          bairro,
          cidade,
          estado,
          cep,
          dataNascimento,
          numeroCelular,
          email,
          avatarUrl,
          role,
        } = request.body

        const usuarioId = await request.getCurrentUserId()
        const { membership, organizacao } =
          await request.getUserMembership(slug)

        const { cannot } = buscarPermissoesUsuario(usuarioId, membership.role)

        if (cannot('create', 'Usuario')) {
          throw new UnauthorizedError(
            'Você não possui permissões para criar contas de usuários.',
          )
        }

        const senhaProvisoria = gerarSenhaAleatoria(7)

        const usuario = await prisma.usuario.create({
          data: {
            nome,
            rua,
            bairro,
            cidade,
            estado,
            cep,
            dataNascimento,
            numeroCelular,
            email,
            avatarUrl,
            passwordHash: await hash(senhaProvisoria, 6),
            membros: {
              create: {
                role,
                tipo: 'FUNCIONARIO',
                organizacaoId: organizacao.id,
              },
            },
          },
        })

        // Envia dados de login por email para o usuário
        console.log({
          emial: usuario.email,
          senha: senhaProvisoria,
        })

        return reply.status(201).send()
      },
    )
}
