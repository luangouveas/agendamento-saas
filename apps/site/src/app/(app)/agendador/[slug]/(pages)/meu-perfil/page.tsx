import { AlertTriangle } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'

import { buscarPerfilDoUsuarioLogado } from '../actions'
import MeuPerfilForm from './meu-perfil-form'

export default async function MeuPerfilPage() {
  const { usuario, success, message } = await buscarPerfilDoUsuarioLogado()

  return (
    <div className="space-y-4 px-4">
      {!success && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            <p>{message}</p>
          </AlertTitle>
        </Alert>
      ) : (
        <div className="">
          <h2 className="text-center font-semibold">Meus dados</h2>
          <MeuPerfilForm usuario={usuario!} />
        </div>
      )}
    </div>
  )
}
