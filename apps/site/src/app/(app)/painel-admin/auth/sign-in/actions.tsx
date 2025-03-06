'use server'

import { entrarComSenha } from '@/http/entrar-com-email-senha'

export async function entrarComEmailSenha(data: FormData) {
  const { email, password } = Object.fromEntries(data)

  const result = await entrarComSenha({
    email: String(email),
    password: String(password),
  })

  console.log(result)
}
