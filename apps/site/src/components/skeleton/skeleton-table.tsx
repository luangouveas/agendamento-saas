import { Skeleton } from '../ui/skeleton'

export function SkeletonTable() {
  return (
    <div className="flex w-full flex-col space-y-4">
      <Skeleton className="h-10 rounded-sm" />
      <div className="space-y-2">
        <Skeleton className="h-10 rounded-none" />
        <Skeleton className="h-10 rounded-none" />
        <Skeleton className="h-10 rounded-none" />
      </div>
    </div>
  )
}
