type HeaderGenericProps<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

export function MainHeader({ children }: HeaderGenericProps) {
  return (
    <header className="fixed top-0 z-50 flex w-full flex-col gap-2 rounded-md border-b-2 bg-background">
      <div className="flex h-16 items-center justify-between rounded-xl bg-background p-6">
        {children}
      </div>
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
