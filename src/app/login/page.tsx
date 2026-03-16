'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const supabase = createClient()

  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const redirectTo = `${window.location.origin}/auth/callback`
      console.log('[Login] Initiating Google Auth with redirectTo:', redirectTo)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      console.error('Login error:', err)
      const message = err instanceof Error ? err.message : 'Failed to initialize Google login'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 flex-col items-center justify-center p-12 text-white">
        {/* Background decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tighter">NoteSaver<span className="text-blue-200">AI</span></h1>
          <p className="text-xl text-blue-100 mb-12 max-w-sm mx-auto leading-relaxed font-light">
            Your premium AI-powered productivity ecosystem for notes, video summaries, and beyond.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['📝 Smart Notes', '📺 YouTube AI', '💼 Job Search', '🔐 Secure'].map((f) => (
              <span
                key={f}
                className="px-5 py-2.5 bg-white/10 rounded-2xl text-sm font-semibold backdrop-blur-md border border-white/10"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F8FAFC]">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">NoteSaver AI</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 text-lg">Enter your AI workspace to continue creating.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-700 transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">One-click sign in</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              { icon: '🔒', text: 'Your data is secure and private' },
              { icon: '⚡', text: 'No password needed, ever' },
              { icon: '✨', text: 'Instant access to all features' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-gray-500">
                <span className="text-base">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <span className="underline cursor-pointer hover:text-blue-600">Terms</span> and{' '}
            <span className="underline cursor-pointer hover:text-blue-600">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
