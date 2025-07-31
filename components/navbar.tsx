"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <img src="/logo.svg" className="h-full w-full object-contain" />
          </div>
          <span className="text-xl font-bold text-brand-dark">Urbánika</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-dark">
          <Link href="/#initiatives" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Iniciativas Clave
          </Link>
          <Link href="/#about" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Nuestra Historia
          </Link>
          <Link href="/#bus-tech" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Casa Rodante
          </Link>
          <Link href="/#houses" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Casa del Futuro
          </Link>
          <Link href="/#contact" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/investment" prefetch={false}>
            <Button className="hidden md:inline-flex bg-brand-yellow text-brand-dark hover:bg-yellow-400 font-semibold">
              Invertir
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-brand-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 px-4 py-4 bg-white shadow-lg rounded-b-lg space-y-4 text-sm font-medium text-brand-dark">
          <Link href="/#initiatives" className="block hover:text-brand-aqua" prefetch={false}>
            Iniciativas Clave
          </Link>
          <Link href="/#about" className="block hover:text-brand-aqua" prefetch={false}>
            Nuestra Historia
          </Link>
          <Link href="/#bus-tech" className="block hover:text-brand-aqua" prefetch={false}>
            Casa Rodante
          </Link>
          <Link href="/#houses" className="block hover:text-brand-aqua" prefetch={false}>
            Casa del Futuro
          </Link>
          <Link href="/#contact" className="block hover:text-brand-aqua" prefetch={false}>
            Contacto
          </Link>
          <Link href="/investment" className="block text-center bg-brand-yellow text-brand-dark font-semibold py-2 rounded hover:bg-yellow-400" prefetch={false}>
            Invertir
          </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar
