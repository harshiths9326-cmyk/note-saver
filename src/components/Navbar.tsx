import Link from 'next/link'
import AuthButton from './AuthButton'
import { Highlighter } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Highlighter className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              NoteSaver AI
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/notes" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              My Notes
            </Link>
            <Link href="/summarizer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              YouTube Summarizer
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Job Search
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
