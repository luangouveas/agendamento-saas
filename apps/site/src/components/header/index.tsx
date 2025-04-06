import { cn } from '@/lib/utils'

type HeaderGenericProps<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

export function MainHeader({ className, children }: HeaderGenericProps) {
  return (
    <header
      className={cn(
        `"mx-auto xl:px-0" flex items-center justify-between px-2`,
        className,
      )}
    >
      {children}
    </header>
  )
}

export function HeaderContent({ children }: HeaderGenericProps) {
  return <>{children}</>
}

export function HeaderContentLeft({ children }: HeaderGenericProps) {
  return <div className="flex items-center gap-3">{children}</div>
}

export function HeaderContentRight({ children }: HeaderGenericProps) {
  return <div className="flex items-center gap-4">{children}</div>
}
