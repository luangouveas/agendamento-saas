'use server'

import { isBefore, isEqual } from 'date-fns'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getSlugOrganizacaoAtual } from '@/auth/auth'
import { AtualizarExpediente } from '@/http/atualizar-expediente'
import { CriarExpediente } from '@/http/criar-expediente'
import { ExcluirExpediente } from '@/http/exclui-expediente'
import { MarcarExpedientePrincipal } from '@/http/marcar-expediente-principal'

const expedienteSchema = z
  .object({
    membroId: z.string().uuid(),
    id: z.string().uuid().optional(),
    nome: z
      .string()
      .min(1, { message: 'Deve especificar um nome para o expediente' }),
    diasExpediente: z.array(
      z.object({
        diaSemana: z.coerce
          .number()
          .min(1)
          .max(7)
          .transform((x) => Number(x)), // TEM QUE TRANSFORMAR EM NUMERO
        inicio: z.string({
          message: 'Inicio do expediente deve ser informado',
        }),
        fim: z.string({ message: 'Termino do expediente deve ser informado' }),
        inicioIntervalo: z.string().optional().nullable(),
        fimIntervalo: z.string().optional().nullable(),
      }),
    ),
  })
  .superRefine(({ diasExpediente }, ctx) => {
    diasExpediente.forEach((d) => {
      if (d.inicio && d.fim) {
        const inicio = new Date(`1970-01-01 ${d.inicio}`)
        const fim = new Date(`1970-01-01 ${d.fim}`)

        if (isBefore(fim, inicio) || isEqual(inicio, fim)) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Horario inicio do expediente não pode ser igual ou posterior ao final',
            path: ['diasExpediente'],
          })
        }

        if (d.inicioIntervalo && d.fimIntervalo) {
          const inicioIntervalo = new Date(`1970-01-01 ${d.inicioIntervalo}`)
          const fimIntervalo = new Date(`1970-01-01 ${d.fimIntervalo}`)

          if (
            isBefore(fimIntervalo, inicioIntervalo) ||
            isEqual(inicioIntervalo, fimIntervalo)
          ) {
            ctx.addIssue({
              code: 'custom',
              message:
                'Horario inicio do intervalo não pode ser igual ou posterior ao final',
              path: ['diasExpediente'],
            })
          }

          if (
            isBefore(fim, inicioIntervalo) ||
            isBefore(inicioIntervalo, inicio) ||
            isBefore(fimIntervalo, inicio) ||
            isBefore(fim, fimIntervalo)
          ) {
            ctx.addIssue({
              code: 'custom',
              message:
                'Horario do intervalo deve estar contemplado dentro do horario do expediente.',
              path: ['diasExpediente'],
            })
          }
        }

        if (
          (d.inicioIntervalo && !d.fimIntervalo) ||
          (!d.inicioIntervalo && d.fimIntervalo)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: 'Intervalo deve possuir inicio e fim',
            path: ['diasExpediente'],
          })
        }
      }
    })
  })

export type ExpedienteSchema = z.infer<typeof expedienteSchema>

function parseDiasExpediente(data: Record<string, any>) {
  const diasExpediente: any[] = []

  Object.entries(data).forEach(([key, value]) => {
    const match = key.match(/^diasExpediente\[(\d+)\]\.(.+)$/)
    if (match) {
      const index = parseInt(match[1])
      const field = match[2]

      if (!diasExpediente[index]) {
        diasExpediente[index] = {}
      }

      diasExpediente[index][field] = value || undefined // trata campos vazios como undefined
    }
  })

  // remove entradas completamente vazias (sem 'inicio' e 'fim')
  const diasExpedienteFiltrados = diasExpediente.filter(
    (d) => d.inicio || d.fim || d.inicioIntervalo || d.fimIntervalo,
  )

  return {
    diasExpediente: diasExpedienteFiltrados,
  }
}

export async function CriarExpedienteAction(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const diasTratados = parseDiasExpediente(raw)

  const data = {
    membroId: raw.membroId,
    nome: raw.nome,
    ...diasTratados,
  }

  console.log(data)

  const resultParse = expedienteSchema.safeParse(data)

  if (!resultParse.success) {
    const listErrors = resultParse.error.errors
    return {
      success: false,
      message: listErrors[0].message,
      errors: null,
    }
  }

  const slug = await getSlugOrganizacaoAtual()

  try {
    const { membroId } = resultParse.data
    await CriarExpediente({
      slug: slug!,
      ...resultParse.data,
    })
    revalidateTag(`${membroId}/expedientes`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Expediente criado com sucesso.',
    errors: null,
  }
}

export async function AtualizarExpedienteAction(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const diasTratados = parseDiasExpediente(raw)

  const data = {
    id: raw.id,
    membroId: raw.membroId,
    nome: raw.nome,
    ...diasTratados,
  }

  const resultParse = expedienteSchema.safeParse(data)

  if (!resultParse.success) {
    const listErrors = resultParse.error.errors
    return {
      success: false,
      message: listErrors[0].message,
      errors: null,
    }
  }

  const slug = await getSlugOrganizacaoAtual()

  try {
    const { membroId, id, ...data } = resultParse.data
    await AtualizarExpediente({
      expedienteId: id!,
      slug: slug!,
      ...data,
    })
    revalidateTag(`${membroId}/expedientes`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Expediente criado com sucesso.',
    errors: null,
  }
}

export async function ExcluirExpedienteAction(
  membroId: string,
  expedienteId: string,
) {
  try {
    const slug = await getSlugOrganizacaoAtual()
    await ExcluirExpediente({ slug: slug!, expedienteId })
    revalidateTag(`${membroId}/expedientes`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Expediente excluído com sucesso!',
    errors: null,
  }
}

export async function MarcarExpedientePrincipalAction(
  membroId: string,
  expedienteId: string,
) {
  try {
    const slug = await getSlugOrganizacaoAtual()
    await MarcarExpedientePrincipal({ slug: slug!, membroId, expedienteId })
    revalidateTag(`${membroId}/expedientes`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Ocorreu um erro inesperado.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Expediente marcado como principal!',
    errors: null,
  }
}
