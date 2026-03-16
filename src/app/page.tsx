'use client'

import { Youtube, Sparkles, Zap, BookOpen, Clock, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const router = useRouter()

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) {
      router.push(`/summarizer?url=${encodeURIComponent(url)}`)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen AI Summarization</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
            >
              Turn any YouTube video into <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                smart notes instantly
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Save hours of watching. Get high-quality AI summaries, bullet points, and study notes from any YouTube video in seconds.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleGetStarted}
              className="max-w-3xl mx-auto mb-16"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                  <div className="flex-1 flex items-center px-4">
                    <Youtube className="w-6 h-6 text-red-500 mr-3 hidden sm:block" />
                    <input
                      type="text"
                      placeholder="Paste YouTube video URL here..."
                      className="w-full py-3 text-lg border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
                  >
                    Generate Summary
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Features Preview */}
            <div className="grid md:grid-cols-4 gap-6 mt-20">
              {[
                { icon: Clock, title: "Short Summary", desc: "Get the gist in 2 minutes", color: "blue" },
                { icon: FileText, title: "Detailed Report", desc: "Comprehensive breakdown", color: "indigo" },
                { icon: Zap, title: "Bullet Notes", desc: "Actionable key points", color: "amber" },
                { icon: BookOpen, title: "Study Guide", desc: "Perfect for students", color: "emerald" },
              ].map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feat.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feat.icon className={`w-6 h-6 text-${feat.color}-600`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-600">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900">NoteSaver AI</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 NoteSaver AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/login" className="hover:text-blue-600">Log In</Link>
            <Link href="/notes" className="hover:text-blue-600">Privacy</Link>
            <Link href="/jobs" className="hover:text-blue-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
