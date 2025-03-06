'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { entrarComTelefone, solicitarEntrarComTelefone } from './actions'

/*
 AJUSTES A SEREM FEITOS:

 API
  - Ao tentar logar com celular, verificar se o celular tem usuario com vinculo de FUNCIONARIO com a sempresa,
    caso possua, deve retornar um erro informando que o login deve ser no painel
  
  - Ajustar arquivo de seed para teste com valores que permitam testes mais faceis 
    (Documentar os dados de acesso e empresa para facilitar)

  - Ao reenviar codigo de verificação, deve apagar os anteriores, se houver

 SITE
  - Exibir informações nos botões com status (Enviando, validando, etc...) e bloquear
    quando estiver com esses estados
  - Separar formulários de login em componentes

 TESTES
  - Criar dados com seed
  - Autenticar com usuario inexistente
  - Autenticar com usuario existente
*/

const formLoginComCelularSchema = z.object({
  ddi: z.string(),
  telefone: z.string().min(5, {
    message: 'O número do celular é obrigatório.',
  }),
})

const formValidarCodigoSchema = z.object({
  codigoDeVerificacao: z.string().min(6, {
    message: 'O código de verificação deve conter 6 digitos.',
  }),
})

type Params = Promise<{ slug: string }>

export default function SignInPage(props: { params: Params }) {
  const [numeroEnviado, setNumeroEnviado] = useState<string>('')
  const [step, setStep] = useState<number>(1)
  const [resendTimer, setResendTimer] = useState<number>(30)

  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const router = useRouter()
  const { slug } = use(props.params)

  const formLoginComCelular = useForm<
    z.infer<typeof formLoginComCelularSchema>
  >({
    resolver: zodResolver(formLoginComCelularSchema),
    defaultValues: {
      ddi: '+55',
      telefone: '',
    },
  })

  const formValidarCodigo = useForm<z.infer<typeof formValidarCodigoSchema>>({
    resolver: zodResolver(formValidarCodigoSchema),
    defaultValues: {
      codigoDeVerificacao: '',
    },
  })

  function handleSubmitLoginComCelular(
    values: z.infer<typeof formLoginComCelularSchema>,
  ) {
    const telefone = `${values.ddi} ${values.telefone}`

    solicitarEntrarComTelefone(telefone).then((result) => {
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        setNumeroEnviado(telefone)
        setStep(2)
        setResendTimer(30)
      }
    })
  }

  function handleSubmitVerificacao(
    values: z.infer<typeof formValidarCodigoSchema>,
  ) {
    entrarComTelefone(
      numeroEnviado,
      Number(values.codigoDeVerificacao),
      slug,
    ).then((result) => {
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        router.push(`/novo-agendamento`)
      }
    })
  }

  function handleReenviarCodigoVerificacao() {
    solicitarEntrarComTelefone(numeroEnviado).then(() => {
      setNumeroEnviado(numeroEnviado)
      setStep(2)
      setResendTimer(30)
    })
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (step === 2 && resendTimer > 0) {
      timer = setInterval(
        () => setResendTimer((prev: number) => prev - 1),
        1000,
      )
    }
    return () => clearInterval(timer)
  }, [step, resendTimer])

  return (
    <div className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro durante o login</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {step === 1 ? (
        <Form {...formLoginComCelular}>
          <form
            className="w-full space-y-8 rounded-xl border p-6"
            onSubmit={formLoginComCelular.handleSubmit(
              handleSubmitLoginComCelular,
            )}
          >
            <div className="flex flex-row gap-2">
              <FormField
                control={formLoginComCelular.control}
                name="ddi"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>DDI</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue="+55"
                        onValueChange={(val: string) => field.onChange(val)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="+27">+27</SelectItem>
                            <SelectItem value="+55">+55</SelectItem>
                            <SelectItem value="+93">+93</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formLoginComCelular.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel>Seu celular</FormLabel>
                    <FormControl>
                      <Input autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Enviar código
            </Button>
          </form>
        </Form>
      ) : (
        <div className="w-full space-y-3 rounded-xl border p-6">
          <Form {...formValidarCodigo}>
            <form
              onSubmit={formValidarCodigo.handleSubmit(handleSubmitVerificacao)}
              className="space-y-8"
            >
              <FormField
                control={formValidarCodigo.control}
                name="codigoDeVerificacao"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center space-y-6">
                    <FormLabel>Código de verificação enviado!</FormLabel>
                    <FormControl>
                      <InputOTP width={100} maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Confirmar código
              </Button>
            </form>
          </Form>

          <Button
            type="button"
            onClick={handleReenviarCodigoVerificacao}
            className="w-full"
            disabled={resendTimer > 0}
          >
            {resendTimer > 0
              ? `Reenviar código (${resendTimer}s)`
              : 'Reenviar código'}
          </Button>
        </div>
      )}
    </div>
  )
}
