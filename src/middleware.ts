import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './utils/constants';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = await getToken({ req: request });
  const isProtectedRoute = PROTECTED_ROUTES.includes(path)
  const isPublicRoute = PUBLIC_ROUTES.includes(path)

  if(isProtectedRoute && !token?.userId) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl))
  }

  // Redirect to /admin if the user is authenticated
  if(isPublicRoute && token?.isAdmin && !request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl))
  }

  if(isPublicRoute && token?.userId && request.nextUrl.pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
