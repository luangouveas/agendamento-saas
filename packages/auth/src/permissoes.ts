import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from './criar-app-ability'
import { Usuario } from './models/usuario'
import { Role } from './roles'

type PermissionsByRole = (
  usuario: Usuario,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissoes: Record<Role, PermissionsByRole> = {
  ADMIN(usuario, { can, cannot }) {
    can('manage', 'all')

    cannot('update', 'Organizacao')
    can('update', 'Organizacao', { ownerId: { $eq: usuario.id } })
  },
  ATENDENTE(usuario, { can, cannot }) {
    can('get', 'Usuario')
    can('get', 'Servico')

    cannot(['create', 'get', 'update'], 'Agendamento')
    can(['create', 'get', 'update', 'cancelar_agendamento'], 'Agendamento', {
      profissionalId: { $eq: usuario.id },
    })
  },
  RECEPCIONISTA(_, { can }) {
    can('get', 'Usuario')
    can('get', 'Servico')
    can(['create', 'get', 'update'], 'Agendamento')
  },
  CLIENTE(usuario, { can, cannot }) {
    cannot(['create', 'get', 'update'], 'Agendamento')
    can(['create', 'get', 'update', 'cancelar_agendamento'], 'Agendamento', {
      clienteId: { $eq: usuario.id },
    })
  },
  FINANCEIRO(_, { can }) {
    return can
  },
}
