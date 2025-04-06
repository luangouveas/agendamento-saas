import Header from '@/app/painel/_components/header'

export default async function Home() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] pt-10">
        <div className="space-y-4 px-4">
          <p className="text-sm text-muted-foreground">
            Selecione uma organização.
          </p>
        </div>
      </main>
    </div>
  )
}
