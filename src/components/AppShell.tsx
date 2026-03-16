'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import NavbarWrapper from './NavbarWrapper'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Routes that should NOT have the Sidebar (Landing and Login)
  const isLanding = pathname === '/'
  const isLogin = pathname === '/login'
  const isSidebarVisible = !isLanding && !isLogin

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isSidebarVisible && <Sidebar />}
      <div className={isSidebarVisible ? "flex-1 ml-20 lg:ml-64 transition-all duration-300" : "flex-1"}>
        {!isSidebarVisible && <NavbarWrapper />}
        <main className={!isSidebarVisible ? "pt-16" : ""}>
          {children}
        </main>
      </div>
    </div>
  )
}
