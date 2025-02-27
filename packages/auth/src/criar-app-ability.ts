import { CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability'
import { z } from 'zod'

import { agendamentoSubject } from './subjects/agendamento'
import { membroSubject } from './subjects/membro'
import { organizacaoSubject } from './subjects/organizacao'
import { servicoSubject } from './subjects/servico'
import { usuarioSubject } from './subjects/usuario'

const appAbilitiesSchema = z.union([
  agendamentoSubject,
  organizacaoSubject,
  servicoSubject,
  usuarioSubject,
  membroSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const criarAppAbility = createMongoAbility as CreateAbility<AppAbility>
