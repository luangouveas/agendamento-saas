import { AbilityBuilder } from '@casl/ability'

import { criarAppAbility } from './criar-app-ability'
import { Usuario } from './models/usuario'
import { permissoes } from './permissoes'

export * from './roles'
export * from './models/agendamento'
export * from './models/organizacao'
export * from './models/usuario'
export * from './models/expediente'

export function defineAbilityFor(usuario: Usuario) {
  const builder = new AbilityBuilder(criarAppAbility)

  if (typeof permissoes[usuario.role] !== 'function') {
    throw new Error(`Permissão para ${usuario.role} não encontrada.`)
  }

  permissoes[usuario.role](usuario, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
