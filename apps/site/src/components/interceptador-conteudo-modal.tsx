'use client'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent } from '@/components/ui/dialog'

interface InterceptedModalContentProps {
  children: React.ReactNode
}
export default function InterceptedModalContent({
  children,
}: InterceptedModalContentProps) {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }
  return (
    <Dialog
      defaultOpen
      onOpenChange={(v) => {
        if (v === false) {
          onDismiss()
        }
      }}
    >
      <DialogContent className="max-w-2xl">{children}</DialogContent>
    </Dialog>
  )
}
