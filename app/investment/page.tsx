"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  Users,
  Vote,
  Gift,
  Home,
  Leaf,
  Shield,
  Calculator,
  MessageCircle,
  Zap,
  Target,
  Heart,
  Sparkles,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  Loader2,
  Mail
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
// TODO: Import from actual crossmint library implementation once available
type MintNFTParams = {
  recipientEmail: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
};

type MintNFTResult = {
  success: boolean;
  actionId?: string;
  error?: string;
};

type CheckStatusResult = {
  success: boolean;
  data?: {
    status?: string;
    token?: {
      chain?: string;
      contractAddress?: string;
    };
  };
  error?: string;
};

// Temporary mock implementations
const mintNFT = async (params: MintNFTParams): Promise<MintNFTResult> => {
  return {
    success: true,
    actionId: "mock-action-id"
  };
};

const checkMintStatus = async (actionId: string): Promise<CheckStatusResult> => {
  return {
    success: true,
    data: {
      status: "success",
      token: {
        chain: "polygon-amoy",
        contractAddress: "0x1234567890"
      }
    }
  };
};

export { mintNFT, checkMintStatus };

type MintResult = {
  data?: {
    token?: {
      chain?: string;
      contractAddress?: string;
    };
    status?: string;
  };
  success?: boolean;
  error?: string;
};

type PurchaseState = "idle" | "confirming" | "minting" | "checking" | "success" | "error"

export default function NFTInvestmentComponent() {
  // Investment calculator state
  const [investmentAmount, setInvestmentAmount] = useState(50000)
  const [showInvestForm, setShowInvestForm] = useState(false)
  
  // NFT purchase state
  const [purchaseState, setPurchaseState] = useState<PurchaseState>("idle")
  const [email, setEmail] = useState("")
  const [actionId, setActionId] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [mintResult, setMintResult] = useState<MintResult | null>(null)

  const nftBenefits = [
    {
      icon: TrendingUp,
      title: "Retorno de inversión 1.5x",
      description: "Con revenue-based financing respaldado por ventas reales de casas",
      details: "Tu inversión está respaldada por las ventas reales de casas. Con cada casa Urbanika vendida, distribuimos $50,000 MXN entre todos los NFTs, hasta que recibas 1.5 veces lo que invertiste.",
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
      details: "Participa en decisiones clave sobre nuevos desarrollos, alianzas estratégicas y evolución del ecosistema Urbanika.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Gift,
      title: "Recompensas exclusivas",
      description: "Puntos canjeables en la Tienda Urbanika por productos y servicios",
      details: "Recibe puntos canjeables en la Tienda Urbanika por productos, servicios y beneficios dentro de nuestra red.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ]

  const investmentStats = [
    { label: "Casas necesarias para ROI completo", value: "45", icon: Home },
    { label: "Distribución por casa vendida", value: "$50K MXN", icon: Coins },
    { label: "Retorno esperado", value: "1.5x", icon: TrendingUp },
    { label: "Inversores actuales", value: "127", icon: Users },
  ]

  const asset = {
    name: "Urbanika Smart Home Token",
    collection: "Smart, Decentralized and Regenerative Homes",
    price: "50,000 MXN",
    priceUSD: "~$2,750 USD",
    type: "Smart Home Investment",
    location: "Mexico",
    powerOutput: "Solar Integrated",
    ecoRating: "Regenerative",
    returnRate: "1.5x ROI",
    paymentModel: "$50,000 MXN distributed per house sold",
    housesRequired: "45 houses for full return",
  }

  const calculateReturns = (amount: number) => {
    const expectedReturn = amount * 1.5
    const monthlyReturn = expectedReturn / 24 // Estimado a 2 años
    return { expectedReturn, monthlyReturn }
  }

  const { expectedReturn, monthlyReturn } = calculateReturns(investmentAmount)

  const handlePurchase = () => {
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address")
      return
    }
    setErrorMessage("")
    setPurchaseState("confirming")
  }

  const handleConfirm = async () => {
    setPurchaseState("minting")

    try {
      const result = await mintNFT({
        recipientEmail: email,
        metadata: {
          name: asset.name,
          description: `Smart Home Investment NFT by Urbanika. Income-based financing with 1.5x return. Investment: ${asset.price} returns ${asset.priceUSD}. Payment model: ${asset.paymentModel} until full ${asset.returnRate} return is achieved.`,
          image: "/crossmint.jpg",
          attributes: [
            { trait_type: "Project", value: "Urbanika Smart Homes" },
            { trait_type: "Investment Type", value: asset.type },
            { trait_type: "Location", value: asset.location },
            { trait_type: "ROI", value: asset.returnRate },
            { trait_type: "Payment Model", value: asset.paymentModel },
            { trait_type: "Houses Required", value: asset.housesRequired },
            { trait_type: "Eco Rating", value: asset.ecoRating },
            { trait_type: "Energy", value: asset.powerOutput },
          ],
        },
      })

      if (result.success && result.actionId) {
        setActionId(result.actionId)
        setPurchaseState("checking")
        checkStatus(result.actionId)
      } else {
        setErrorMessage(result.error || "Failed to initiate mint")
        setPurchaseState("error")
      }
    } catch {
      setErrorMessage("Network error occurred")
      setPurchaseState("error")
    }
  }

  const checkStatus = async (id: string) => {
    try {
      const status = await checkMintStatus(id)

      if (status.success) {
        const data = status.data && typeof status.data === 'object' ? status.data as MintResult["data"] : undefined;
        if (data?.status === "success") {
          setMintResult({ ...status, data });
          setPurchaseState("success")
        } else if (data?.status === "failed") {
          setErrorMessage("Minting failed on blockchain")
          setPurchaseState("error")
        } else {
          setTimeout(() => checkStatus(id), 3000)
        }
      } else {
        setErrorMessage(status.error || "Failed to check status")
        setPurchaseState("error")
      }
    } catch {
      setErrorMessage("Failed to check mint status")
      setPurchaseState("error")
    }
  }

  const handleReset = () => {
    setPurchaseState("idle")
    setEmail("")
    setActionId("")
    setErrorMessage("")
    setMintResult(null)
  }

  const renderPurchaseFooter = () => {
    switch (purchaseState) {
      case "idle":
        return (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-brand-dark">
                <Mail className="w-4 h-4" />
                Email para entrega
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-brand-aqua/30 focus:border-brand-aqua"
              />
              {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
            </div>
            <Button onClick={handlePurchase} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-brand-aqua to-brand-yellow text-white">
              Iniciar Compra
            </Button>
          </div>
        );
      case "confirming":
        return (
          <div className="w-full space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Estás a punto de adquirir un NFT de alto valor.</p>
              <p className="text-xs text-brand-aqua">NFT será entregado a: {email}</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full h-12 border-brand-aqua text-brand-dark hover:bg-brand-aqua/10"
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirm} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-brand-aqua to-brand-yellow text-white">
                Adquirir NFT
              </Button>
            </div>
          </div>
        );
      case "minting":
        return (
          <Button disabled className="w-full h-14 text-lg font-bold bg-brand-dark text-white">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Creando NFT...
          </Button>
        );
      case "checking":
        return (
          <div className="w-full text-center space-y-2">
            <Button disabled className="w-full h-14 text-lg font-bold bg-brand-aqua text-white">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Confirmando en Blockchain...
            </Button>
            <p className="text-xs text-gray-500">ID de transacción: {actionId.slice(0, 8)}...</p>
          </div>
        );
      case "success":
        return (
          <div className="w-full text-center space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <div>
              <p className="text-xl font-bold text-brand-dark">¡NFT Creado Exitosamente!</p>
              <p className="text-sm text-gray-600">Entregado a {email}</p>
            </div>
            {mintResult && (
              <div className="text-xs text-brand-aqua space-y-1">
                <p>Blockchain: {mintResult.data?.token?.chain || "polygon-amoy"}</p>
                <p>Contrato: {mintResult.data?.token?.contractAddress?.slice(0, 10)}...</p>
              </div>
            )}
            <Button onClick={handleReset} variant="link" className="mt-2 text-brand-dark hover:text-brand-aqua">
              Adquirir otro NFT
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="w-full text-center space-y-3">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <div>
              <p className="text-xl font-bold text-red-500">Error en la creación</p>
              <p className="text-xs text-gray-500">{errorMessage}</p>
            </div>
            <Button onClick={handleReset} variant="link" className="mt-2 text-brand-dark hover:text-brand-aqua">
              Intentar de nuevo
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-aqua/5 via-white to-brand-yellow/5">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
            <Navbar/>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-brand-yellow animate-pulse" />
          </div>

          <Badge className="mb-4 bg-brand-yellow/20 text-brand-dark border-brand-yellow/30 text-lg px-4 py-2">
            🌍 NFTs de Inversión
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6">
            Invierte en hogares que regeneran el mundo
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Imagina una inversión que no solo genera valor financiero, sino también ecológico, social y tecnológico.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Investment Calculator */}
          <Card className="bg-gradient-to-r from-brand-aqua/10 to-brand-yellow/10 border-brand-aqua/20 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-brand-aqua" />
                  Calculadora de Inversión
                </h3>
                <p className="text-gray-600">
                  Descubre tu retorno potencial con nuestro modelo de revenue-based financing
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">Monto de inversión (MXN)</label>
                    <Input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="text-lg font-semibold"
                      min="10000"
                      step="5000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/80 rounded-lg border border-brand-aqua/20">
                      <div className="text-2xl font-bold text-green-600">${expectedReturn.toLocaleString()} MXN</div>
                      <div className="text-sm text-gray-600">Retorno total esperado</div>
                    </div>
                    <div className="p-4 bg-white/80 rounded-lg border border-brand-aqua/20">
                      <div className="text-2xl font-bold text-brand-aqua">${monthlyReturn.toLocaleString()} MXN</div>
                      <div className="text-sm text-gray-600">Retorno mensual estimado</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NFT Purchase Card */}
          <Card className="bg-white border-brand-aqua/20 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="p-0 relative h-64">
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-brand-aqua/50 shadow-md">
                  <Image src="/crossmint.jpg" width={100} height={100} alt="Urbanika NFT" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-brand-aqua/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                {asset.collection}
              </div>
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-white/90 to-transparent">
                <h2 className="text-2xl font-bold tracking-tighter text-gray-900">{asset.name}</h2>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-mono text-brand-dark">{asset.price}</p>
                  <p className="text-lg font-mono text-gray-600">{asset.priceUSD}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-brand-aqua" />
                <div>
                  <p className="text-xs text-gray-500">Inversión</p>
                  <p className="font-semibold text-gray-900">{asset.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-aqua" />
                <div>
                  <p className="text-xs text-gray-500">Ubicación</p>
                  <p className="font-semibold text-gray-900">{asset.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-brand-aqua" />
                <div>
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className="font-semibold text-brand-dark">{asset.returnRate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-brand-aqua" />
                <div>
                  <p className="text-xs text-gray-500">Modelo</p>
                  <p className="font-semibold text-brand-dark">{asset.ecoRating}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              {renderPurchaseFooter()}
            </CardFooter>
          </Card>
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

        {/* Investment Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {investmentStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-8 w-8 text-brand-aqua mx-auto mb-3" />
                  <div className="text-2xl font-bold text-brand-dark mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Revenue Model Explanation */}
        <Card className="mb-16 bg-gradient-to-r from-white to-gray-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Cómo funciona el Revenue-Based Financing</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Se requieren aproximadamente 45 casas para completar el monto total a recaudar
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
                  $50,000 MXN se distribuyen proporcionalmente entre todos los NFT holders
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
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-brand-aqua to-brand-yellow text-white shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-6 text-white" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">🎯 Súmate al movimiento</h3>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Hazte parte de una red de inversores conscientes que creen que la vivienda del futuro no se especula: se
                construye, se comparte y se cuida.
              </p>

              <div className="text-2xl font-bold mb-8">Invierte en hogares que dan vida.</div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                  onClick={() => setShowInvestForm(true)}
                  className="bg-white text-brand-aqua hover:bg-gray-100 font-bold text-lg px-8 py-4"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Invertir Ahora
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 bg-transparent font-bold text-lg px-8 py-4"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Más Información
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Form Modal */}
        {showInvestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-brand-aqua to-brand-yellow text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Solicitar Información de Inversión</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInvestForm(false)}
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">Nombre *</label>
                      <Input placeholder="Tu nombre" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">Apellido *</label>
                      <Input placeholder="Tu apellido" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Email *</label>
                    <Input type="email" placeholder="tu@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Teléfono</label>
                    <Input placeholder="+52 55 1234 5678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Monto de inversión estimado
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Selecciona un rango</option>
                      <option>$10,000 - $50,000 MXN</option>
                      <option>$50,000 - $100,000 MXN</option>
                      <option>$100,000 - $500,000 MXN</option>
                      <option>$500,000+ MXN</option>
                      <option>Por definir</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      ¿Qué te interesa más de esta inversión? *
                    </label>
                    <Textarea
                      placeholder="Cuéntanos qué te motiva a invertir en Urbanika y qué aspectos te interesan más..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowInvestForm(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-brand-aqua text-white hover:bg-teal-600">
                      <Coins className="mr-2 h-4 w-4" />
                      Enviar solicitud
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
       
      </main>
    <Footer/>
    </div>
  )
}