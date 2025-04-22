import { PenSquare } from 'lucide-react'
import Link from 'next/link'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { BuscarExpedientesMembro } from '@/http/buscar-expedientes-membro'

import { CheckExpedientePrincipal } from './check-expediente-principal'
import { ConfirmaExclusaoExpediente } from './confirma-exclusao-expediente'

export default async function ListaExpedientes({
  membroId,
}: {
  membroId: string
}) {
  const slug = await getSlugOrganizacaoAtual()
  const { expedientes } = await BuscarExpedientesMembro({
    slug: slug!,
    membroId,
  })

  return (
    <div className="space-y-2">
      <div className="rounded border">
        <Table>
          <TableBody>
            {expedientes.map((expediente) => {
              return (
                <TableRow key={expediente.id}>
                  <TableCell className="py-2.5">{expediente.nome}</TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2 pr-4">
                      <CheckExpedientePrincipal
                        expedienteId={expediente.id}
                        membroId={membroId}
                        className="mr-2"
                        disabled={expediente.expedientePrincipal}
                        checked={expediente.expedientePrincipal}
                      />
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/painel/${slug}/profissionais/${membroId}/expedientes/editar/${expediente.id}`}
                        >
                          <PenSquare className="mr-2 size-4" />
                          Editar
                        </Link>
                      </Button>
                      <ConfirmaExclusaoExpediente
                        id={expediente.id}
                        membroId={membroId}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
