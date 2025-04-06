import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()

  const [, , slug] = pathname.split('/')

  const cookieStore = await cookies()
  const tokenadmin = cookieStore.get('ag-tk-admin')
  if (tokenadmin?.value) {
    response.cookies.set('agendador-token', tokenadmin.value)
  }

  const temSlug =
    !pathname.startsWith('/painel/minha-conta') &&
    !pathname.startsWith('/painel/auth') &&
    slug

  if (temSlug) {
    response.cookies.set('agendador-organizacao', slug)
  } else {
    response.cookies.delete('agendador-organizacao')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
