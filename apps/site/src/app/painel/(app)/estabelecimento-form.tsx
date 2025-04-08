'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import {
  atualizarOrganizacao,
  criarOrganizacao,
  OrganizacaoType,
} from './actions'

interface EstabelecimentoFormProps {
  isUpdating?: boolean
  initialData?: OrganizacaoType
}

export function EstabelecimentoForm({
  initialData,
  isUpdating,
}: EstabelecimentoFormProps) {
  const formAction = isUpdating ? atualizarOrganizacao : criarOrganizacao

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(formAction)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha ao criar o estabelecimento!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label>Nome</Label>
        <Input
          name="nome"
          type="text"
          defaultValue={initialData?.nome ?? undefined}
        />
        {errors?.nome && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.nome[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Razão Social</Label>
        <Input
          name="razaoSocial"
          type="text"
          defaultValue={initialData?.razaoSocial ?? undefined}
        />
        {errors?.razaoSocial && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.razaoSocial[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>CNPJ/CPF</Label>
        <Input
          name="cnpj"
          type="text"
          defaultValue={initialData?.cnpj ?? undefined}
        />
        {errors?.cnpj && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.cnpj[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>CEP</Label>
        <Input
          name="cep"
          type="text"
          defaultValue={initialData?.cep ?? undefined}
        />
        {errors?.cep && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.cep[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Rua</Label>
        <Input
          name="rua"
          type="text"
          defaultValue={initialData?.rua ?? undefined}
        />
        {errors?.rua && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.rua[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Bairro</Label>
        <Input
          name="bairro"
          type="text"
          defaultValue={initialData?.bairro ?? undefined}
        />
        {errors?.bairro && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.bairro[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Cidade</Label>
        <Input
          name="cidade"
          type="text"
          defaultValue={initialData?.cidade ?? undefined}
        />
        {errors?.cidade && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.cidade[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Estado</Label>
        <Input
          name="estado"
          type="text"
          defaultValue={initialData?.estado ?? undefined}
        />
        {errors?.estado && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.estado[0]}
          </p>
        )}
      </div>

      <Button className="mt-3" type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Salvando...
          </>
        ) : (
          'Salvar estabelecimento'
        )}
      </Button>
    </form>
  )
}
