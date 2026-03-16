import Link from 'next/link'
import AuthButton from './AuthButton'
import { Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              NoteSaver<span className="text-blue-600">AI</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-all hover:translate-y-[-1px]">
              Home
            </Link>
            <Link href="/notes" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-all hover:translate-y-[-1px]">
              My Notes
            </Link>
            <Link href="/summarizer" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-all hover:translate-y-[-1px]">
              Summarizer
            </Link>
            <Link href="/jobs" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-all hover:translate-y-[-1px]">
              Job AI
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
