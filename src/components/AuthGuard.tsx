'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthGuard] Checking auth...')
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('[AuthGuard] User:', user?.email || 'none', 'Error:', error?.message || 'none')
      if (!user) {
        console.log('[AuthGuard] No user, redirecting to /login')
        router.push('/login')
      } else {
        console.log('[AuthGuard] User found, allowing access')
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [router, supabase])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
