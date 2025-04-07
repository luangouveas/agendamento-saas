import Header from '@/app/painel/_components/header'

import { EstabelecimentoForm } from '../estabelecimento-form'

export default function NovoEstabelecimentoPage() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Novo estabelecimento</h1>
        <EstabelecimentoForm />
      </main>
    </div>
  )
}
