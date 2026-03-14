'use client'

import { createClient } from '@/lib/supabase/client'
import { Highlighter, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex-col items-center justify-center p-12 text-white">
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
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Highlighter className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">NoteSaver AI</h1>
          <p className="text-xl text-blue-100 mb-12 max-w-sm mx-auto leading-relaxed">
            Your all-in-one AI-powered workspace for notes, video summaries, and job searching.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['📝 Smart Notes', '📺 YouTube AI', '💼 Job Search', '🔐 Secure'].map((f) => (
              <span
                key={f}
                className="px-4 py-2 bg-white/15 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Highlighter className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NoteSaver AI</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</h2>
            <p className="text-gray-500">Sign in to access your personal AI workspace.</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-700 transition-all duration-200 group"
          >
            {/* Google Icon SVG */}
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
            Continue with Google
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
