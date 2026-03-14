'use client'

import { useState } from 'react'
import { Search, Briefcase, MapPin, DollarSign, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Job {
  title: string
  company: string
  location: string
  salary: string
  description: string
}

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return

    setLoading(true)
    setError('')
    setJobs([])

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setJobs(data.jobs)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-4">
          <Briefcase className="text-blue-600 w-10 h-10" />
          AI Job Search
        </h1>
        <p className="text-lg text-gray-600">Find your next role with Firecrawl-powered web extraction and AI analysis.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title or keyword"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
            />
          </div>
          <div className="md:col-span-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Remote)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Find Jobs
              </>
            )}
          </button>
        </form>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{job.title}</h3>
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-blue-600 font-medium text-sm mb-4">{job.company}</p>
                
                <div className="space-y-2 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                  {job.description}
                </p>
              </div>

              <button className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                View Details
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-24 grayscale opacity-20">
          <Briefcase className="w-24 h-24 mx-auto mb-4" />
          <p className="text-xl font-medium">Search to find job listings...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-24 text-red-500 font-medium">
          {error}
        </div>
      )}
    </div>
  )
}
