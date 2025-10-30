"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  ArrowRight,
  Shield,
  Percent,
  Clock,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import NFTPurchaseFlow from "@/components/nft-purchase-flow"
import { MyInvestments } from "@/components/my-investments"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function NFTInvestmentPage() {
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)
  const [selectedAmountUSD, setSelectedAmountUSD] = useState(13) // El componente trabaja en USD

  const nftBenefits = [
    {
      icon: TrendingUp,
      title: "Retorno garantizado 1.5x",
      description: "Revenue-based financing respaldado por ventas reales",
      details:
        "Tu inversión está respaldada por las ventas reales de casas. Con cada casa Urbanika vendida, distribuimos entre todos los NFT holders, hasta que recibas 1.5 veces lo que invertiste.",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
    },
    {
      icon: Zap,
      title: "Acceso prioritario",
      description: "Preferencia exclusiva para adquirir casas y servicios",
      details: "Tendrás preferencia para adquirir casas, módulos, servicios o upgrades antes que el público general.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
    },
    {
      icon: Vote,
      title: "Voz y voto",
      description: "Decide el futuro de Urbanika junto con la comunidad",
      details:
        "Participa en decisiones clave sobre nuevos desarrollos, alianzas estratégicas y evolución del ecosistema Urbanika.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
    },
    {
      icon: Gift,
      title: "Recompensas exclusivas",
      description: "Puntos canjeables y beneficios dentro del ecosistema",
      details:
        "Recibe puntos canjeables en la Tienda Urbanika por productos, servicios y beneficios dentro de nuestra red.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
    },
  ]

  const investmentStats = [
    {
      label: "Inversores",
      value: "127+",
      icon: Users,
      color: "text-brand-aqua",
      bgColor: "bg-brand-aqua/10"
    },
    {
      label: "Retorno",
      value: "1.5x",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Casas",
      value: "45",
      icon: Home,
      color: "text-brand-yellow",
      bgColor: "bg-brand-yellow/20"
    },
  ]

  // Valores de inversión en USD (el componente trabaja en USD internamente)
  const quickAmounts = [
    { amountUSD: 13, amountMXN: 250, label: "250", popular: true, tier: "Bronze" },
    { amountUSD: 26, amountMXN: 500, label: "500", popular: false, tier: "Silver" },
    { amountUSD: 52, amountMXN: 1000, label: "1,000", popular: false, tier: "Silver" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-aqua/5 via-white to-brand-yellow/5">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Wallet Connect Section */}
        <div className="flex justify-end mb-4 mt-20">
          <WalletConnectButton />
        </div>

        {/* Hero Section - Más impactante */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-96 h-96 bg-brand-aqua rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-10 w-10 text-brand-yellow animate-pulse" />
              <Badge className="bg-gradient-to-r from-brand-aqua to-brand-yellow text-white border-0 text-lg px-6 py-2 shadow-lg">
                NFTs de Inversión Regenerativa
              </Badge>
              <Sparkles className="h-10 w-10 text-brand-aqua animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-brand-dark mb-6 leading-tight">
              Invierte desde <span className="text-brand-aqua">$250 MXN</span>
              <br />
              <span className="bg-gradient-to-r from-brand-aqua to-brand-yellow bg-clip-text text-transparent">
                Recibe 1.5x de retorno
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Únete a la revolución de vivienda sostenible. Tu inversión ayuda a construir casas regenerativas
              y te genera retorno garantizado.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {investmentStats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`${stat.bgColor} rounded-2xl px-8 py-4 shadow-md hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <div className="text-left">
                      <div className="text-3xl font-bold text-brand-dark">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Calculator Section - Más visual */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-brand-aqua/30 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Left side - NFT Visual */}
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-aqua/20 to-brand-yellow/20 p-8 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                  <div className="relative z-10 text-center">
                    <div className="relative w-64 h-64 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-aqua to-brand-yellow rounded-full blur-2xl opacity-50 animate-pulse" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                        <Image
                          src="/nft-image.png"
                          width={256}
                          height={256}
                          alt="Urbanika NFT"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <Badge className="bg-white/90 backdrop-blur-sm text-brand-dark border-0 text-sm px-4 py-2">
                      <Shield className="w-4 h-4 mr-2 inline" />
                      Inversión Verificada en Blockchain
                    </Badge>
                  </div>
                </div>

                {/* Right side - Calculator */}
                <div className="lg:col-span-3 p-8 md:p-12">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-brand-aqua/10 rounded-xl">
                        <Calculator className="h-6 w-6 text-brand-aqua" />
                      </div>
                      <h2 className="text-3xl font-bold text-brand-dark">Calcula tu inversión</h2>
                    </div>
                    <p className="text-gray-600 text-lg">
                      Elige tu monto y comienza a generar retornos con casas regenerativas
                    </p>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {quickAmounts.map(({ amountUSD, amountMXN, label, popular, tier }) => (
                      <div key={amountUSD} className="relative">
                        {popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 shadow-md">
                              ⭐ Más Popular
                            </Badge>
                          </div>
                        )}
                        <Button
                          onClick={() => {
                            setSelectedAmountUSD(amountUSD)
                            setShowPurchaseFlow(true)
                          }}
                          variant="outline"
                          className={`w-full h-auto flex flex-col gap-2 p-6 transition-all ${
                            popular
                              ? "border-2 border-brand-aqua bg-brand-aqua/5 shadow-lg hover:shadow-xl scale-105"
                              : "border-2 border-gray-200 hover:border-brand-aqua hover:bg-brand-aqua/5 hover:shadow-md"
                          }`}
                        >
                          <div className="text-3xl font-bold text-brand-dark">${label}</div>
                          <div className="text-xs text-gray-500">MXN ≈ ${amountUSD} USD</div>
                          <Badge variant="outline" className="text-xs border-brand-aqua/50 text-brand-aqua">
                            {tier}
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">
                            <ArrowRight className="inline w-3 h-3 mr-1" />
                            Retorno: ${(amountMXN * 1.5).toLocaleString()} MXN
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setShowPurchaseFlow(true)}
                    variant="link"
                    className="text-brand-aqua hover:text-brand-aqua/80 mb-6"
                  >
                    O personaliza tu monto de inversión →
                  </Button>

                  {/* ROI Preview */}
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Percent className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-brand-dark mb-1">Proyección de retorno</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Ejemplo con inversión de $250 MXN (~$13 USD)
                          </p>
                          <Progress value={33} className="h-2 mb-3" />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Inversión inicial</p>
                              <p className="font-bold text-lg text-brand-dark">$250 MXN</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Retorno total (1.5x)</p>
                              <p className="font-bold text-lg text-green-600">$375 MXN</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-green-200">
                        <Clock className="h-4 w-4" />
                        <span>El tiempo de retorno depende de la velocidad de ventas de casas</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Paga con tarjeta (Stripe)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Paga con crypto (Web3)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Investments Section */}
        <div className="mb-16">
          <MyInvestments />
        </div>

        {/* Benefits Section - Rediseñado */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand-aqua/10 text-brand-aqua border-brand-aqua/30 text-sm px-4 py-2">
              Beneficios exclusivos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Más que un retorno financiero
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Al invertir en Urbanika NFTs, recibes beneficios tangibles que transforman tu experiencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {nftBenefits.map((benefit, index) => (
              <Card
                key={index}
                className={`${benefit.bgColor} border-2 border-transparent hover:border-brand-aqua/50 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-4 ${benefit.iconBg} rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className={`h-8 w-8 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-aqua transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-700 font-medium mb-3">{benefit.description}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works - Revenue Model */}
        <Card className="mb-16 bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl border-2 border-gray-200 overflow-hidden">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-brand-yellow/20 text-brand-dark border-brand-yellow/30 text-sm px-4 py-2">
                Revenue-Based Financing
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                ¿Cómo funciona tu inversión?
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tu retorno está respaldado por ventas reales de casas Urbanika
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-aqua/20 to-brand-aqua/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Home className="h-10 w-10 text-brand-aqua" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-aqua text-white font-bold text-sm mb-3">
                  1
                </div>
                <h4 className="font-bold text-xl text-brand-dark mb-3">Casa Vendida</h4>
                <p className="text-gray-600 leading-relaxed">
                  Cada vez que vendemos una casa Urbanika, se activa la distribución automática de retornos
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Coins className="h-10 w-10 text-brand-yellow" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-yellow text-brand-dark font-bold text-sm mb-3">
                  2
                </div>
                <h4 className="font-bold text-xl text-brand-dark mb-3">Distribución</h4>
                <p className="text-gray-600 leading-relaxed">
                  Los ingresos se distribuyen proporcionalmente entre todos los NFT holders activos
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm mb-3">
                  3
                </div>
                <h4 className="font-bold text-xl text-brand-dark mb-3">Retorno Completo</h4>
                <p className="text-gray-600 leading-relaxed">
                  Recibes pagos progresivos hasta completar 1.5x tu inversión inicial
                </p>
              </div>
            </div>

            {/* Visual Progress Example */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-brand-dark mb-2">
                      Ejemplo: Inversión de $250 MXN
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Así es como tu inversión genera retorno con cada venta
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Inversión inicial</span>
                        <span className="font-bold text-brand-dark">$250 MXN</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Meta de retorno (1.5x)</span>
                        <span className="font-bold text-green-600">$375 MXN</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ganancia neta</span>
                        <span className="font-bold text-brand-aqua">$125 MXN</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-blue-200">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        <strong>Nota:</strong> El tiempo de retorno depende de la velocidad de ventas.
                        Con 45 casas en producción, esperamos distribuciones regulares. Una vez que alcances
                        tu 1.5x, tu NFT queda completado y puedes reinvertir o transferirlo.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Final CTA - Más impactante */}
        <Card className="bg-gradient-to-r from-brand-aqua via-brand-aqua/90 to-brand-yellow text-white shadow-2xl border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <CardContent className="p-12 md:p-16 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                <Target className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Invierte desde $250 MXN hoy
              </h3>

              <p className="text-xl md:text-2xl opacity-95 mb-10 leading-relaxed">
                Hazte parte de una red de <strong>127+ inversores conscientes</strong> que creen que la vivienda
                del futuro no se especula: se construye, se comparte y se cuida.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={() => setShowPurchaseFlow(true)}
                  size="lg"
                  className="bg-white text-brand-aqua hover:bg-gray-100 font-bold text-xl px-10 py-7 h-auto shadow-xl hover:shadow-2xl transition-all"
                >
                  <Coins className="mr-3 h-6 w-6" />
                  Comenzar inversión
                </Button>

                <Button
                  onClick={() => setShowPurchaseFlow(true)}
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold text-xl px-10 py-7 h-auto"
                >
                  Ver mis inversiones
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Inversión mínima: $250 MXN</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Retorno garantizado: 1.5x</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Pagos seguros con Stripe o Crypto</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />

      {/* Purchase Flow Modal */}
      {showPurchaseFlow && (
        <NFTPurchaseFlow
          onClose={() => setShowPurchaseFlow(false)}
          initialAmount={selectedAmountUSD}
        />
      )}
    </div>
  )
}
