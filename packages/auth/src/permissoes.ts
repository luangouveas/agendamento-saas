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

    cannot(['update', 'delete'], 'Organizacao')
    can(['update', 'delete'], 'Organizacao', { ownerId: { $eq: usuario.id } })
  },
  ATENDENTE(usuario, { can, cannot }) {
    can('get', 'Usuario')
    can('get', 'Servico')

    cannot(
      [
        'create',
        'get',
        'update',
        'concluir_agendamento',
        'cancelar_agendamento',
        'confirmar_agendamento',
        'reabrir_agendamento',
        'transferir_agendamento',
      ],
      'Agendamento',
    )
    can(
      [
        'create',
        'get',
        'update',
        'concluir_agendamento',
        'cancelar_agendamento',
        'confirmar_agendamento',
        'transferir_agendamento',
      ],
      'Agendamento',
      {
        profissionalId: { $eq: usuario.id },
        clienteId: { $ne: usuario.id },
      },
    )
    can(
      ['create', 'get', 'confirmar_agendamento', 'cancelar_agendamento'],
      'Agendamento',
      {
        profissionalId: { $ne: usuario.id },
        clienteId: { $eq: usuario.id },
      },
    )

    cannot(
      ['get', 'create', 'delete', 'update', 'marcar_principal'],
      'Expediente',
    )
    can('create', 'Expediente')
    can(['get', 'update', 'marcar_principal', 'delete'], 'Expediente', {
      usuarioId: { $eq: usuario.id },
    })
  },
  RECEPCIONISTA(usuario, { can, cannot }) {
    can('get', 'Servico')
    can('get', 'Usuario')
    can('manage', 'Agendamento')

    cannot('update', 'Usuario')
    can('update', 'Usuario', { id: { $eq: usuario.id } })
  },
  CLIENTE(usuario, { can, cannot }) {
    cannot(
      [
        'create',
        'get',
        'update',
        'concluir_agendamento',
        'cancelar_agendamento',
        'confirmar_agendamento',
        'reabrir_agendamento',
        'transferir_agendamento',
      ],
      'Agendamento',
    )
    can(
      [
        'create',
        'get',
        'update',
        'concluir_agendamento',
        'cancelar_agendamento',
        'confirmar_agendamento',
      ],
      'Agendamento',
      {
        clienteId: { $eq: usuario.id },
      },
    )
    can('get', ['Servico', 'Expediente', 'Usuario'])
    can('create', 'Agendamento', { clienteId: { $eq: usuario.id } })

    cannot(['update', 'get'], 'Usuario')
    can(['update', 'get'], 'Usuario', { id: { $eq: usuario.id } })
  },
  FINANCEIRO(_, { can }) {
    return can
  },
}
