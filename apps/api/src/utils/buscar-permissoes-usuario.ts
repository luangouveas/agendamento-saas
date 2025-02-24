import { defineAbilityFor, Role, usuarioSchema } from '@agendamento-saas/auth'

export function buscarPermissoesUsuario(userId: string, role: Role) {
  const authUser = usuarioSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
