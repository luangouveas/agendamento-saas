import 'fastify'

import { Membro, Organizacao } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(
      slug: string,
    ): Promise<{ organizacao: Organizacao; membership: Membro }>
  }
}
