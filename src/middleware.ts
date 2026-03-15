import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export default async function middleware(request: NextRequest) {
  // console.log('[Middleware] Intercepting:', request.nextUrl.pathname)
  const response = await updateSession(request)
  
  return response || NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/notes',
    '/summarizer',
    '/jobs',
    '/login',
    '/auth/callback'
  ],
}
