import { ScrollArea } from '@/components/ui/scroll-area'

import { ListaServicos } from './lista-servicos'

export default function ServicosPage() {
  return (
    <div className="space-y-4 px-4">
      <h2 className="text-center font-semibold">Escolha um serviço</h2>
      <ScrollArea className="h-[700px] w-full rounded-md">
        <ListaServicos />
      </ScrollArea>
    </div>
  )
}
