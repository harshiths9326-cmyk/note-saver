import { NextResponse } from 'next/server'
// The client you created in Step 3
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    console.log('--- Auth Callback: Exchanging code for session ---')
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      console.log('--- Auth Callback: Success, redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('--- Auth Callback: Error exchanging code ---', error)
  } else {
    console.warn('--- Auth Callback: No code found in URL ---')
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
