import TrocarAvatar from '@/components/trocar-avatar'
import { buscarPerfil } from '@/http/buscar-perfil'

import MeuPerfilForm from './meu-perfil-form'

export default async function MeuPerfilPage() {
  const { usuario } = await buscarPerfil()

  return (
    <div className="space-y-4 px-4">
      <TrocarAvatar
        tipoRegistro="usuarios"
        idRegistro={usuario.id}
        avatarUrlAtual={usuario.avatarUrl}
        nomeTagRevalidar="atualizou-perfil"
        size={16}
      />
      <MeuPerfilForm usuario={usuario!} />
    </div>
  )
}
