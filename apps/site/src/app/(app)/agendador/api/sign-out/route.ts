import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { getSlugOrganizacaoAtual } from '@/app/auth/auth'

export async function GET(request: NextRequest) {
  const slug = await getSlugOrganizacaoAtual()

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/agendador/${slug}/sign-in`

  const ck = await cookies()

  ck.delete('agendador-token')

  return NextResponse.redirect(redirectUrl)
}
