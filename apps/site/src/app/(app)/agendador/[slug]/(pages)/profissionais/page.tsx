import { ScrollArea } from '@/components/ui/scroll-area'

import ListaProfissionais from './lista-profissionais'

export default async function ProfissionaisPage() {
  return (
    <div className="space-y-4 px-4">
      <h2 className="text-center font-semibold">
        Escolha o profissional desejado
      </h2>
      <ScrollArea className="h-[700px] w-full rounded-md">
        <ListaProfissionais />
      </ScrollArea>
    </div>
  )
}
