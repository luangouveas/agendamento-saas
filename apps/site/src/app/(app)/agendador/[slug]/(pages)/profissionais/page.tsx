import ListaProfissionais from './lista-profissionais'

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { servicoId = '' } = await searchParams

  return (
    <div className="space-y-4 px-4">
      <h2 className="text-center font-semibold">
        Escolha o profissional desejado
      </h2>
      {servicoId && <ListaProfissionais servicoId={servicoId} />}
    </div>
  )
}
