'use client'

import Navbar from './Navbar'
import { usePathname } from 'next/navigation'

export default function NavbarWrapper() {
  const pathname = usePathname()
  const hideNavbar = pathname === '/login'

  if (hideNavbar) return null

  return <Navbar />
}
