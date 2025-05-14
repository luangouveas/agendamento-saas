'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Flag from 'react-world-flags'
import { mask, unMask } from 'remask'
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
import { paises } from '@/lib/paises'
import { mascarasTelefone } from '@/lib/utils'

import { entrarComTelefone, solicitarEntrarComTelefone } from './actions'

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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const router = useRouter()
  const { slug } = use(props.params)

  const formLoginComCelular = useForm<
    z.infer<typeof formLoginComCelularSchema>
  >({
    resolver: zodResolver(formLoginComCelularSchema),
    defaultValues: {
      ddi: 'BR +55',
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
    const ddi = values.ddi.split(' ')[1]
    const numero = values.telefone.replace(/[ ()-]/g, '')

    const telefone = `${ddi} ${numero}`

    setIsSubmitting(true)
    solicitarEntrarComTelefone(telefone).then((result) => {
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        setNumeroEnviado(telefone)
        setStep(2)
        setResendTimer(30)
      }
      setIsSubmitting(false)
    })
  }

  function handleSubmitVerificacao(
    values: z.infer<typeof formValidarCodigoSchema>,
  ) {
    setIsSubmitting(true)

    entrarComTelefone(
      numeroEnviado,
      Number(values.codigoDeVerificacao),
      slug,
    ).then((result) => {
      if (!result?.success) {
        setSuccess(false)
        setMessage(result!.message)
      } else {
        router.push(`/app/${slug}/novo-agendamento`)
      }
      setIsSubmitting(false)
    })
  }

  function handleReenviarCodigoVerificacao() {
    solicitarEntrarComTelefone(numeroEnviado).then((result) => {
      if (result.success) {
        setNumeroEnviado(numeroEnviado)
        setStep(2)
        setResendTimer(30)
      } else {
        setSuccess(false)
        setMessage(result.message)
      }
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
                        onValueChange={(val: string) => field.onChange(val)}
                        {...field}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectGroup>
                            {paises.map((pais) => (
                              <SelectItem
                                key={`${pais.code} ${pais.dial_code}`}
                                value={`${pais.code} ${pais.dial_code}`}
                                className="items-left"
                              >
                                <div className="flex w-full flex-row justify-around gap-4">
                                  <Flag
                                    className="w-5 rounded-full"
                                    code={pais.code}
                                  />
                                  <span className="line-clamp-1 text-base">
                                    {pais.dial_code}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
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
                      <Input
                        {...field}
                        autoFocus
                        onChange={(e) => {
                          const original = unMask(e.target.value)
                          const mascarado = mask(original, mascarasTelefone)
                          formLoginComCelular.setValue('telefone', mascarado)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Enviar código'
              )}
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
                    <FormLabel className="flex w-full flex-col items-center justify-center">
                      <p>Código de verificação enviado!</p>
                      <p>
                        {`Verifique o telefone ${formLoginComCelular.getValues('ddi').split(' ')[1]} ${formLoginComCelular.getValues('telefone')}`}
                      </p>
                    </FormLabel>
                    <FormControl>
                      <InputOTP width={100} maxLength={6} {...field} autoFocus>
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
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Confirmar código'
                )}
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
