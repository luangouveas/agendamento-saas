import { AlertTriangle } from 'lucide-react'

import Header from '@/app/painel/_components/header'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Home() {
  return (
    <div className="space-y-4 py-4 pt-6">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] pt-14">
        <div className="flex w-full justify-center space-y-4 px-4">
          <Alert
            variant="alert"
            className="text-center md:max-w-md lg:max-w-lg xs:max-w-sm"
          >
            <AlertTriangle className="size-4" />
            <AlertDescription>
              Selecione um estabelecimento para ver suas informações.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}
