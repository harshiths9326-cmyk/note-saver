import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // console.log('Proxy Intercepting:', request.nextUrl.pathname) // Uncomment for local debugging if needed
  const response = await updateSession(request)
  
  if (response) {
    return response
  }
  
  return NextResponse.next()
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
