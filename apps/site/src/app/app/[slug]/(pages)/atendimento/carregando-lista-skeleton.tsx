import { Skeleton } from '@/components/ui/skeleton'

export default function CarregandoListaSkeleton() {
  const numeroDeItens = 2

  return (
    <div className="rounded-md border">
      {Array.from({ length: numeroDeItens }, (_, index) => (
        <ItemSkeleton key={index} />
      ))}
    </div>
  )
}

function ItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-4">
      <div className="flex items-center space-x-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[180px] sm:w-[300px]" />
          <Skeleton className="h-2 w-[100px]" />
          <Skeleton className="h-2 w-[150px] sm:w-[200px]" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}
