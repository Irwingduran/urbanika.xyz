"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Coins,
  TrendingUp,
  Users,
  Vote,
  Gift,
  Home,
  Calculator,
  Zap,
  Target,
  Sparkles,
  CheckCircle,
  DollarSign,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import NFTPurchaseFlow from "@/components/nft-purchase-flow"
import { ContractStats } from "@/components/contract-stats"
import { MyInvestments } from "@/components/my-investments"

export default function NFTInvestmentPage() {
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(500)

  const nftBenefits = [
    {
      icon: TrendingUp,
      title: "Retorno de inversión 1.5x",
      description: "Con revenue-based financing respaldado por ventas reales de casas",
      details:
        "Tu inversión está respaldada por las ventas reales de casas. Con cada casa Urbanika vendida, distribuimos entre todos los NFTs holders, hasta que recibas 1.5 veces lo que invertiste.",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Zap,
      title: "Acceso prioritario",
      description: "Preferencia para adquirir casas, módulos y servicios antes que el público general",
      details: "Tendrás preferencia para adquirir casas, módulos, servicios o upgrades antes que el público general.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Vote,
      title: "Voz y voto",
      description: "Participa en decisiones clave sobre desarrollos y alianzas estratégicas",
      details:
        "Participa en decisiones clave sobre nuevos desarrollos, alianzas estratégicas y evolución del ecosistema Urbanika.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Gift,
      title: "Recompensas exclusivas",
      description: "Puntos canjeables en la Tienda Urbanika por productos y servicios",
      details:
        "Recibe puntos canjeables en la Tienda Urbanika por productos, servicios y beneficios dentro de nuestra red.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ]

  const investmentStats = [
    { label: "Inversores actuales", value: "127+", icon: Users },
    { label: "Retorno esperado", value: "1.5x", icon: TrendingUp },
    { label: "Casas en producción", value: "45", icon: Home },
  ]

  const quickAmounts = [
    { amount: 250, label: "250", popular: false },
    { amount: 500, label: "500", popular: true },
    { amount: 1000, label: "1000", popular: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-aqua/5 via-white to-brand-yellow/5">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-brand-yellow animate-pulse" />
          </div>

          <Badge className="mb-4 bg-brand-yellow/20 text-brand-dark border-brand-yellow/30 text-lg px-4 py-2">
            NFTs de Inversión
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6">
            Invierte en hogares que regeneran el mundo
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Únete a la revolución de vivienda sostenible. Tu inversión ayuda a construir casas regenerativas y te
            genera retorno de 1.5x.
          </p>
        </div>

        {/* NFT Card + Calculator Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* NFT Card with Image */}
          <Card className="bg-white border-brand-aqua/20 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-80 bg-gradient-to-br from-brand-aqua/10 to-brand-yellow/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-brand-aqua/50 shadow-2xl">
                    <Image
                      src="/nft-image.png"
                      width={224}
                      height={224}
                      alt="Urbanika NFT"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-brand-aqua/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                   Hogares Inteligentes, Descentralizados y Regenerativos
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Urbánika Token</h2>
                <p className="text-gray-600 mb-4">Inversión basada en ingresos NFT</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-aqua" />
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className="font-semibold text-brand-dark">1.5x</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-brand-aqua" />
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="font-semibold text-brand-dark">Regenerativo</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick investment CTA */}
          <Card className="bg-gradient-to-r from-brand-aqua/10 to-brand-yellow/10 border-brand-aqua/20 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-brand-aqua" />
                <h3 className="text-xl font-bold text-brand-dark">Comienza tu inversión</h3>
              </div>

              <p className="text-gray-600 mb-6">Elige un monto inicial o personalízalo después</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {quickAmounts.map(({ amount, label, popular }) => (
                  <div key={amount} className="relative">
                    {popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-brand-yellow text-brand-dark text-xs">Popular</Badge>
                      </div>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedAmount(amount)
                        setShowPurchaseFlow(true)
                      }}
                      variant={popular ? "default" : "outline"}
                      className={`w-full h-24 flex flex-col ${
                        popular
                          ? "bg-gradient-to-r from-brand-aqua to-brand-yellow text-white border-0 shadow-lg scale-105"
                          : "border-brand-aqua/30 hover:border-brand-aqua hover:bg-brand-aqua/5"
                      }`}
                    >
                      <div className="text-2xl font-bold">${label}</div>
                      <div className="text-xs opacity-75">MXM</div>
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowPurchaseFlow(true)}
                variant="link"
                className="text-brand-aqua hover:text-brand-aqua/80"
              >
                O elige tu propio monto →
              </Button>

              {/* Key info */}
              <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-brand-aqua/20">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Paga con tarjeta o crypto</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Retorno garantizado 1.5x</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Stats - Connected to Smart Contract */}
        <div className="mb-16">
          <ContractStats />
        </div>

        {/* My Investments Section */}
        <div className="mb-16">
          <MyInvestments />
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">¿Qué recibes al invertir?</h2>
            <p className="text-lg text-gray-600">Beneficios tangibles que van más allá del retorno financiero</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {nftBenefits.map((benefit, index) => (
              <Card
                key={index}
                className={`${benefit.bgColor} border-2 border-brand-aqua/20 shadow-lg hover:shadow-xl transition-all group`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${benefit.color} rounded-full flex-shrink-0`}>
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-brand-dark mb-2">{benefit.title}</h3>
                      <p className="text-gray-700 mb-4">{benefit.description}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works - Revenue Model */}
        <Card className="mb-16 bg-gradient-to-r from-white to-gray-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">
                Cómo funciona el Revenue-Based Financing
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tu inversión genera retorno cada vez que vendemos una casa Urbanika
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-aqua/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-brand-aqua" />
                </div>
                <h4 className="font-bold text-brand-dark mb-2">1. Casa Vendida</h4>
                <p className="text-gray-600 text-sm">
                  Cada vez que vendemos una casa Urbanika, se activa la distribución
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-brand-yellow" />
                </div>
                <h4 className="font-bold text-brand-dark mb-2">2. Distribución</h4>
                <p className="text-gray-600 text-sm">
                  Los ingresos se distribuyen proporcionalmente entre todos los NFT holders
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-bold text-brand-dark mb-2">3. Retorno</h4>
                <p className="text-gray-600 text-sm">Recibes pagos hasta completar 1.5x tu inversión inicial</p>
              </div>
            </div>

            {/* Example calculation */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-2">Ejemplo con inversión de $500 MXM:</p>
                    <ul className="space-y-1">
                      <li>• Tu objetivo de retorno: $750 MXM (1.5x)</li>
                      <li>• Recibes distribuciones con cada casa vendida</li>
                      <li>• El tiempo de retorno depende de la velocidad de ventas</li>
                      <li>• Una vez alcanzado tu 1.5x, tu NFT queda completo</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-brand-aqua to-brand-yellow text-white shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-6 text-white" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Súmate al movimiento</h3>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Hazte parte de una red de inversores conscientes que creen que la vivienda del futuro no se especula:
                se construye, se comparte y se cuida.
              </p>

              <Button
                onClick={() => setShowPurchaseFlow(true)}
                className="bg-white text-brand-aqua hover:bg-gray-100 font-bold text-lg px-8 py-6 h-auto"
              >
                <Coins className="mr-2 h-5 w-5" />
                Comenzar inversión
              </Button>

              <p className="text-sm opacity-75 mt-6">Inversión mínima: $250 MXM • Pago seguro con Stripe o Crypto</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />

      {/* Purchase Flow Modal */}
      {showPurchaseFlow && (
        <NFTPurchaseFlow onClose={() => setShowPurchaseFlow(false)} initialAmount={selectedAmount} />
      )}
    </div>
  )
}
