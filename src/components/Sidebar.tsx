'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  StickyNote, 
  Youtube, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Notes', href: '/notes', icon: StickyNote },
  { name: 'YouTube Summarizer', href: '/summarizer', icon: Youtube },
  { name: 'AI Job Search', href: '/jobs', icon: Briefcase },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Sparkles className="w-6 h-6" />
            <span>NoteSaver</span>
          </div>
        )}
        {collapsed && <Sparkles className="w-8 h-8 text-blue-600 mx-auto" />}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 absolute -right-4 top-10 bg-white border border-gray-100 shadow-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900")} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
