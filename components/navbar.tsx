"use client"
import React, {useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
  
    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 50)
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

  return (
    <header
    className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 lg:px-8 transition-all duration-300 ${
      isScrolled ? "backdrop-blur-md bg-white/90 shadow-lg" : "bg-transparent"
    }`}
  >
    <div className="container mx-auto flex items-center justify-between">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <img src="/logo.svg"   className="h-400 w-400" />
        </div>
        <span className="text-xl font-bold text-brand-dark">Urbánika</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-dark">
        <Link href="#impact" className="hover:text-brand-aqua transition-colors" prefetch={false}>
          Impact
        </Link>
        <Link href="#initiatives" className="hover:text-brand-aqua transition-colors" prefetch={false}>
          Initiatives
        </Link>
        <Link href="#map" className="hover:text-brand-aqua transition-colors" prefetch={false}>
          Global Map
        </Link>
        <Link href="#community" className="hover:text-brand-aqua transition-colors" prefetch={false}>
          Community
        </Link>
        <Link href="#contact" className="hover:text-brand-aqua transition-colors" prefetch={false}>
          Contact
        </Link>
      </nav>
      <Button className="hidden md:inline-flex bg-brand-yellow text-brand-dark hover:bg-yellow-400 font-semibold">
          Investment
      </Button>
    </div>
  </header>
  )
}

export default Navbar

