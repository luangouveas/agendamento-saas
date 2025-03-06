import { api } from './api-client'

interface EntrarComEmailSenhaRequest {
  email: string
  password: string
}

interface EntrarComEmailSenhaResponse {
  token: string
}

export async function entrarComSenha({
  email,
  password,
}: EntrarComEmailSenhaRequest) {
  const result = await api
    .post('auth/email-senha', {
      json: {
        email,
        password,
      },
    })
    .json<EntrarComEmailSenhaResponse>()

  return result
}
