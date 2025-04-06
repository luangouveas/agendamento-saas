import { Crown, LucideTrash2, PenSquare } from 'lucide-react'
import Image from 'next/image'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { buscarServicos } from '@/http/buscar-servicos'

export default async function ListaServicos() {
  const slug = await getSlugOrganizacaoAtual()

  const { servicos } = await buscarServicos(slug!)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Serviços</h2>
      <div className="rouded border">
        <Table>
          <TableBody>
            {servicos.map((servico) => {
              return (
                <TableRow key={servico.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      {servico.avatarUrl && (
                        <AvatarImage
                          src={servico.avatarUrl}
                          width={32}
                          height={32}
                          alt=""
                          className="aspect-square size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {servico.nome}{' '}
                        <span className="text-xs text-muted-foreground">
                          R$ {servico.valor}
                        </span>
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {servico.descricao}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <PenSquare className="mr-2 size-4" />
                        Alterar
                      </Button>
                      <Button size="sm" variant="destructive">
                        <LucideTrash2 className="mr-2 size-4" />
                        Excluir
                      </Button>
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
