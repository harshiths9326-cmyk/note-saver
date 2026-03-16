'use client'

import { useState, useEffect, useCallback } from 'react'
import { Youtube, Sparkles, Copy, Download, Loader2, Layout, List, GraduationCap, FileJson, Clock } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as React.ComponentType<{ url?: string; width?: string | number; height?: string | number; controls?: boolean; [key: string]: unknown }>
import { extractVideoId, getThumbnailUrl } from '@/lib/youtube'
import { SummaryMode } from '@/lib/gemini'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { jsPDF } from 'jspdf'

export default function SummarizerPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [mode, setMode] = useState<SummaryMode>('short')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [history, setHistory] = useState<{ id: string; video_url: string; video_title: string; created_at: string }[]>([])
  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('summaries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (data) setHistory(data)
  }, [supabase])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!url) return

    const vid = extractVideoId(url)
    if (!vid) {
      alert('Invalid YouTube URL')
      return
    }

    setVideoId(vid)
    setLoading(true)
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, mode }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setSummary(data.summary)
      
      // Save to history
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('summaries').insert({
          user_id: user.id,
          video_url: url,
          video_title: 'YouTube Summary',
          content: data.summary
        })
        await fetchHistory()
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to generate summary'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
    alert('Copied to clipboard!')
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('YouTube Video Summary', 20, 20)
    doc.setFontSize(12)
    const splitText = doc.splitTextToSize(summary, 170)
    doc.text(splitText, 20, 35)
    doc.save('summary.pdf')
  }

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "summary.md";
    document.body.appendChild(element);
    element.click();
  }

  const modes = [
    { id: 'short', name: 'Short', icon: Clock, desc: 'Quick overview' },
    { id: 'detailed', name: 'Detailed', icon: Layout, desc: 'Full breakdown' },
    { id: 'bullets', name: 'Bullets', icon: List, desc: 'Key points' },
    { id: 'study', name: 'Study', icon: GraduationCap, desc: 'Concepts + Qs' },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Input & Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Youtube className="w-6 h-6 text-red-500" />
                  YouTube Video Summarizer
                </h1>
                
                <form onSubmit={handleSummarize} className="space-y-6">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Paste YouTube URL here..."
                      className="w-full px-6 py-4 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 pr-12"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {modes.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMode(m.id as SummaryMode)}
                        className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
                          mode === m.id 
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                            : 'border-gray-50 bg-white hover:border-gray-200'
                        }`}
                      >
                        <m.icon className={`w-5 h-5 ${mode === m.id ? 'text-blue-600' : 'text-gray-400'}`} />
                        <div>
                          <p className={`text-sm font-bold ${mode === m.id ? 'text-blue-900' : 'text-gray-900'}`}>{m.name}</p>
                          <p className="text-[10px] text-gray-500 leading-tight">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !url}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating your summary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Summarize Video
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Video Preview */}
              <AnimatePresence>
                {videoId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <div className="aspect-video w-full bg-black">
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary Output */}
              <AnimatePresence>
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">AI Summary</h2>
                      <div className="flex gap-2">
                        <button onClick={copyToClipboard} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                          <Copy className="w-5 h-5 text-gray-500" />
                        </button>
                        <button onClick={downloadMarkdown} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Markdown">
                          <FileJson className="w-5 h-5 text-gray-500" />
                        </button>
                        <button onClick={downloadPDF} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="PDF">
                          <Download className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {summary}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: History & Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Summaries
                </h3>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="group cursor-pointer p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
                        <div className="flex gap-3">
                          <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={getThumbnailUrl(extractVideoId(item.video_url) || '')} alt="Thumb" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.video_url}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-10 text-gray-400 text-sm italic">No history yet</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white overflow-hidden relative group">
                <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-blue-100 mb-4 font-light">Get unlimited summaries, longer transcripts, and multi-language support.</p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:shadow-lg transition-shadow">
                  Upgrade Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
