"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, ArrowRight, Sparkles, X, ChevronRight } from "lucide-react"

export default function InvestmentSidebar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-brand-yellow text-brand-dark hover:bg-yellow-400 shadow-lg rounded-full p-3"
        >
          <Coins className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 max-w-sm">
      <Card className="bg-gradient-to-br from-brand-aqua/95 to-brand-yellow/95 backdrop-blur-sm text-white shadow-2xl border-white/20">
        <CardContent className="p-6 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
            <Badge className="bg-white/20 text-white border-white/30">🌍 NFTs</Badge>
          </div>

          <h3 className="text-lg font-bold mb-2">Invierte en el futuro</h3>

          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            Hogares regenerativos con retorno 1.5x respaldado por ventas reales
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-white" />
              <span>Revenue-based financing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ChevronRight className="h-4 w-4 text-white" />
              <span>Acceso prioritario</span>
            </div>
          </div>

          <Link href="/investment">
            <Button className="w-full bg-white text-brand-aqua hover:bg-gray-100 font-semibold">
              Ver detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <p className="text-white/70 text-xs mt-3 text-center">127+ inversores ya participan</p>
        </CardContent>
      </Card>
    </div>
  )
}
