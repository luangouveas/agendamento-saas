import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const profissionais = [
  { id: 1, avatarUrl: undefined, nome: 'João' },
  {
    id: 2,
    avatarUrl:
      'https://media.istockphoto.com/id/1399395748/pt/foto/cheerful-business-woman-with-glasses-posing-with-her-hands-under-her-face-showing-her-smile-in.jpg?s=612x612&w=0&k=20&c=V2hdZm-cPTPXYT4U7VEsXr9M4CR3QqxOCMY_2qqJQAI=',
    nome: 'Maria',
  },
  { id: 3, avatarUrl: '', nome: 'José' },
  { id: 4, avatarUrl: undefined, nome: 'Ana' },
  {
    id: 5,
    avatarUrl:
      'https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg',
    nome: 'Pedro',
  },
]

interface ListaProfissionaisProps {
  servicoId: string
}

export default async function ListaProfissionais(
  props: ListaProfissionaisProps,
) {
  const slug = await getSlugOrganizacaoAtual()
  // const { profissionais } = await buscarProfissionais(organizacaoAtual!)

  return (
    <div className="flex flex-col gap-5">
      {profissionais.map((profissional) => (
        <Link
          key={profissional.id}
          href={`/agendador/${slug}/escolher-data?servicoId=${props.servicoId}&profissionalId=${profissional.id}`}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex flex-row items-center">
              <div>
                <Avatar className="mr-2 size-8">
                  {profissional.avatarUrl && (
                    <AvatarImage
                      src={profissional.avatarUrl}
                      alt={profissional.nome}
                    />
                  )}
                  <AvatarFallback />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span>{profissional.nome}</span>
                <span className="text-xs">Cargo do Profissional</span>
              </div>
            </div>
            <ChevronRight size={24} className="text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  )
}
