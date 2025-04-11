import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { BuscarConvitesPendentes } from '@/http/buscar-convites-pendentes'

import { BotaoCancelaConvite } from './botao-cancela-convite'
import { CriarConviteForm } from './criar-convite-form'

export async function Convites() {
  const slug = await getSlugOrganizacaoAtual()
  const { convites } = await BuscarConvitesPendentes({ slug: slug! })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Associar profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <CriarConviteForm />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Convites</h2>
        <div className="rounded border">
          <Table>
            <TableBody>
              {convites.map((convite) => {
                return (
                  <TableRow key={convite.id}>
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-muted-foreground">
                          {convite.email}
                        </span>
                        <span className="text-muted-foreground">
                          {convite.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      <div className="flex justify-end">
                        <BotaoCancelaConvite
                          conviteId={convite.id}
                          size="sm"
                          variant="destructive"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {convites.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">
                    Nenhum convite pendente
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
