import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buscarPerfil } from '@/http/buscar-perfil'

import AvatarUsuario from './avatar-usuario'
import MeuPerfilForm from './meu-perfil-form'

export default async function MinhaConta() {
  const { usuario: perfilUsuario } = await buscarPerfil()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader className="border-b">
            <div className="flex w-full flex-row items-center gap-8">
              <AvatarUsuario usuario={perfilUsuario} size={16} />
              <CardTitle>{perfilUsuario.nome}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <MeuPerfilForm perfilUsuario={perfilUsuario} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
