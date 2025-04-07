'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

type HeaderAssinaturaPageProps = {
  updatePlanSuccess?: boolean
}

export default function HeaderAssinaturaPage({
  updatePlanSuccess,
}: HeaderAssinaturaPageProps) {
  const route = useRouter()
  const { toast } = useToast()

  if (updatePlanSuccess) {
    toast({
      variant: 'default',
      title: 'Sucesso!',
      description: 'Sua assinatura foi atualizada com sucesso!',
    })
  }

  return (
    <div className="flex flex-row items-center gap-6">
      <Button
        className="p-0"
        variant="link"
        onClick={() => {
          route.back()
        }}
      >
        <ChevronLeft className="size-5 p-0" />
        <span className="text-xs">Voltar</span>
      </Button>
    </div>
  )
}
