import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

const HeroSection
 = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-50 via-white to-green-50">
    <div className="absolute inset-0 z-0">
      <Image
        src="/Bus.png"
        alt="Paisaje de Ciudad Inteligente"
        layout="fill"
        objectFit="cover"
        className="opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent" />
    </div>
    <div className="relative z-10 container mx-auto px-4 pt-20">
      <div className="animate-fade-in">
       <Badge className="mb-4 bg-brand-aqua/50 text-white border-brand-aqua/20">
      🌱 Construyendo el Futuro Hoy
      </Badge>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-dark via-brand-aqua to-brand-dark">
       Evolucionando Ciudades hacia Comunidades Inteligentes, Regenerativas y Autónomas
      </h1>
      <p className="mt-6 max-w-4xl mx-auto text-2xl md:text-2xl text-gray-600">
       Aprovechamos tecnología de punta e inteligencia colectiva para construir entornos urbanos prósperos que priorizan el bienestar humano y ambiental.
      </p>

        {/*  
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-brand-yellow text-brand-dark hover:bg-yellow-400 font-bold shadow-lg">
            <Play className="mr-2 h-5 w-5" />
            Watch Our Story
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-brand-aqua text-brand-aqua hover:bg-brand-aqua hover:text-white bg-transparent"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Whitepaper
          </Button>
        </div>
        */}
      </div>

    </div>
  </section>
  )
}

export default HeroSection

