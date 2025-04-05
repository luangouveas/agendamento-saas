'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { entrarComSenha } from '@/http/entrar-com-email-senha'
import * as stripeService from '@/services/stripe'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(3, { message: 'Please, provide your password.' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await entrarComSenha({
      email,
      password,
    })

    const cookieStore = await cookies()

    cookieStore.set('ag-tk-admin', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 2, // 2 days
    })

    await stripeService.createStripeCustomer({
      email,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
