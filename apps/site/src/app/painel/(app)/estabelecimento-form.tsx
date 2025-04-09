'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { mask, unmask } from 'remask'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { toast } from '@/hooks/use-toast'
import { ConsultarCEP } from '@/services/brasil-api/consultar-cep'

import {
  atualizarOrganizacao,
  criarOrganizacao,
  OrganizacaoType,
} from './actions'

interface EstabelecimentoFormProps {
  isUpdating?: boolean
  initialData?: OrganizacaoType
}

const mascaraCnpj = '99.999.999/9999-99'
const mascaraCep = '99999-999'

const mascararCnpj = (val: string) => {
  return mask(val, mascaraCnpj)
}

const mascararCep = (val: string) => {
  return mask(val, mascaraCep)
}

export function EstabelecimentoForm({
  initialData,
  isUpdating,
}: EstabelecimentoFormProps) {
  const formAction = isUpdating ? atualizarOrganizacao : criarOrganizacao
  const [cnpj, setCnpj] = useState(mascararCnpj(initialData?.cnpj ?? ''))
  const [cep, setCep] = useState(mascararCep(initialData?.cep ?? ''))
  const [consultandoCep, setConsultandoCep] = useState(false)

  const [rua, setRua] = useState<string | undefined>(
    initialData?.rua ?? undefined,
  )
  const [bairro, setBairro] = useState<string | undefined>(
    initialData?.bairro ?? undefined,
  )
  const [cidade, setCidade] = useState<string | undefined>(
    initialData?.cidade ?? undefined,
  )
  const [uf, setUf] = useState<string | undefined>(
    initialData?.estado ?? undefined,
  )

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(formAction)

  function consultarDadosEndereco(cep: string) {
    const cepOriginal = Number(unmask(cep))
    setConsultandoCep(true)

    ConsultarCEP({ cep: cepOriginal })
      .then((ret) => {
        setRua(ret.street)
        setBairro(ret.neighborhood)
        setCidade(ret.city)
        setUf(ret.state)
      })
      .catch(() => {
        setRua('')
        setBairro('')
        setCidade('')
        setUf('')

        toast({
          variant: 'destructive',
          description: 'Não conseguiu localizar o CEP informado.',
        })
      })
      .finally(() => setConsultandoCep(false))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-2">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha ao salvar o estabelecimento!</AlertTitle>
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

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
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

        <div className="w-full space-y-1">
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
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label>CNPJ</Label>
          <Input
            name="cnpj"
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(mascararCnpj(e.target.value))}
          />
          {errors?.cnpj && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cnpj[0]}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label>CEP</Label>
          <Input
            name="cep"
            type="text"
            value={cep}
            onChange={(e) => setCep(mascararCep(e.target.value))}
            onBlur={(e) => consultarDadosEndereco(e.target.value)}
          />
          {errors?.cep && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cep[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            Rua
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="rua"
            type="text"
            disabled={consultandoCep}
            value={rua}
            onChange={(e) => setRua(e.target.value)}
          />
          {errors?.rua && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.rua[0]}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            Bairro
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="bairro"
            type="text"
            disabled={consultandoCep}
            onChange={(e) => setBairro(e.target.value)}
            value={bairro}
          />
          {errors?.bairro && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.bairro[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            Cidade
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>

          <Input
            name="cidade"
            type="text"
            disabled={consultandoCep}
            onChange={(e) => setCidade(e.target.value)}
            value={cidade}
          />
          {errors?.cidade && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cidade[0]}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label className="flex flex-row items-center">
            UF
            {consultandoCep && <Loader2 className="ml-2 size-3 animate-spin" />}
          </Label>
          <Input
            name="estado"
            type="text"
            maxLength={2}
            disabled={consultandoCep}
            onChange={(e) => setUf(e.target.value)}
            value={uf}
          />
          {errors?.estado && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.estado[0]}
            </p>
          )}
        </div>
      </div>

      <Button
        className="mt-4"
        type="submit"
        disabled={isPending || consultandoCep}
      >
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
