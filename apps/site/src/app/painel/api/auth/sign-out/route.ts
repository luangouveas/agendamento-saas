import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/painel/sign-in`

  const ck = await cookies()

  ck.delete('ag-tk-admin')

  return NextResponse.redirect(redirectUrl)
}
