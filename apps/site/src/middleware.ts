import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()

  const [, slug] = pathname.split('/')
  if (slug) {
    response.cookies.set('agendador-organizacao', slug)
    response.cookies.set(
      'agendador-token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3M2Q4NjkxMC03NGE2LTQyNDktOWM2MS02ZGVlNGEyYzJjZTAiLCJpYXQiOjE3NDIxNzU5MDcsImV4cCI6MTc0Mjc4MDcwN30.xVOPDrQzWrms1QVIJyGqxwGHkJ7mfnGEV0FjvWKoqYA',
    )
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
