import { XOctagonIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { CriarConviteForm } from './criar-convite-form'

export async function Convites() {
  const convites = []

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
                      <span className="text-muted-foreground">
                        {convite.email}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      {convite.role}
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      <div className="flex justify-end">
                        <form>
                          <Button size="sm" variant="destructive">
                            <XOctagonIcon className="mr-2 size-4" />
                            Cancelar convite
                          </Button>
                        </form>
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
