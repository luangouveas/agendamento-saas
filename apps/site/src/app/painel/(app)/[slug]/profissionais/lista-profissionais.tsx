import { Crown, XOctagonIcon } from 'lucide-react'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { buscarMembros } from '@/http/buscar-membros'
import { BuscarOrganizacao } from '@/http/buscar-organizacao'

import { SelectAtualizaRoleMembro } from './select-atualiza-role-membro'

export default async function ListaProfissionais() {
  const slug = await getSlugOrganizacaoAtual()

  const [{ membros }, { organizacao }] = await Promise.all([
    buscarMembros({ slug: slug!, tipo: 'FUNCIONARIO' }),
    BuscarOrganizacao(slug!),
  ])

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">
        Lista de profissionais associados
      </h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {membros.map((membro) => {
              return (
                <TableRow key={membro.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      {membro.avatarUrl && (
                        <AvatarImage
                          src={membro.avatarUrl}
                          width={32}
                          height={32}
                          alt=""
                          className="aspect-square size-full"
                        />
                      )}
                      <AvatarFallback />
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {membro.nome}
                        {organizacao.ownerId === membro.usuarioId && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Crown className="size-3" />
                            Proprietário
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {membro.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <SelectAtualizaRoleMembro
                        membroId={membro.id}
                        value={membro.role}
                        disabled={membro.usuarioId === organizacao.ownerId}
                      />
                      <Button size="sm" variant="destructive">
                        <XOctagonIcon className="mr-2 size-4" />
                        Remover associação
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
