import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { entrarComEmailSenha } from './actions'

export default function SignInPage() {
  return (
    <form action={entrarComEmailSenha} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input name="password" type="password" id="password" />

        <Link
          href="/auth/recuperar-senha"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Entrar com e-mail e senha
      </Button>
    </form>
  )
}
