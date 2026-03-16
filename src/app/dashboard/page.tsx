'use client'

import { Sparkles, Youtube, BookOpen, Search, Clock, ArrowUpRight } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [stats, setStats] = useState({ notes: 0, summaries: 0, jobs: 0 })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [notesRes, sumRes, jobsRes] = await Promise.all([
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('summaries').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('saved_jobs').select('id', { count: 'exact' }).eq('user_id', user.id),
      ])

      setStats({
        notes: notesRes.count || 0,
        summaries: sumRes.count || 0,
        jobs: jobsRes.count || 0,
      })
    }
    fetchStats()
  }, [supabase])

  const tools = [
    { title: 'YouTube Summarizer', icon: Youtube, color: 'red', href: '/summarizer', desc: 'Instant AI summaries of any video' },
    { title: 'Notes Manager', icon: BookOpen, color: 'blue', href: '/notes', desc: 'Secure and organized note taking' },
    { title: 'Job Search AI', icon: Search, color: 'indigo', href: '/jobs', desc: 'Find your next career move' },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your AI-powered tools and productivity.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/summarizer" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
                New Summary
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Notes', value: stats.notes, icon: BookOpen, color: 'blue' },
              { label: 'Summaries', value: stats.summaries, icon: Clock, color: 'amber' },
              { label: 'Saved Jobs', value: stats.jobs, icon: Search, color: 'emerald' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link href={tool.href} className="block group">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 h-full flex flex-col items-start">
                    <div className={`w-14 h-14 rounded-2xl bg-${tool.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className={`w-8 h-8 text-${tool.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      {tool.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                      {tool.desc}
                    </p>
                    <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                      Open Tool <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
