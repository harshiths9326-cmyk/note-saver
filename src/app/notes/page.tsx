'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, StickyNote, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setNotes(data)
    }
    setLoading(false)
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title || !newNote.content) return

    setIsAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('notes')
        .insert([{ ...newNote, user_id: user.id }])
      
      if (!error) {
        setNewNote({ title: '', content: '' })
        fetchNotes()
      } else {
        console.error('Save error:', error)
        alert(`Failed to save note: ${error.message}. Make sure the 'notes' table is created in Supabase.`)
      }
    }
    setIsAdding(false)
  }

  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setNotes(notes.filter(note => note.id !== id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <StickyNote className="text-blue-600" />
            My Notes
          </h1>
          <p className="text-gray-600 mt-2">Capture and organize your important thoughts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Note Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              New Note
            </h2>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Project Ideas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[150px]"
                  placeholder="Start writing..."
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Note
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group relative hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-gray-900 mb-2 pr-8">{note.title}</h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400">
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {notes.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                  <StickyNote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No notes yet. Create your first one!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
