"use client"

import { useAccount } from 'wagmi'
import { useInvestorTokens, useInvestment, useReturnProgress } from '@/hooks/web3/useUrbanikaNFT'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getTierName, type PaymentToken } from '@/lib/web3/abi'
import { formatEther, formatUnits } from 'viem'
import {
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Wallet
} from 'lucide-react'
import { Button } from './ui/button'

/**
 * Componente que muestra las inversiones NFT de un usuario
 * IMPORTANTE: Filtra automáticamente NFTs incorrectos (#1-3)
 * Solo muestra NFTs correctos con valores de 13 USDC (250 MXN)
 *
 * Uso:
 * <MyInvestments />
 */

// Helper para formatear cantidades basado en el token de pago
function formatAmount(amount: bigint, paymentToken: PaymentToken): string {
  if (paymentToken === 0) {
    // ETH: 18 decimales
    return parseFloat(formatEther(amount)).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })
  } else {
    // USDC/USDT: 6 decimales
    return parseFloat(formatUnits(amount, 6)).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
}

// Helper para obtener el símbolo del token
function getTokenSymbol(paymentToken: PaymentToken): string {
  switch (paymentToken) {
    case 0:
      return 'ETH'
    case 1:
      return 'USDC'
    case 2:
      return 'USDT'
    default:
      return 'TOKEN'
  }
}

// Helper para obtener el equivalente en MXN (aproximado)
function getApproxMXN(amount: bigint, paymentToken: PaymentToken): string {
  const usdValue = paymentToken === 0
    ? parseFloat(formatEther(amount)) * 3200 // ETH ≈ $3200 USD
    : parseFloat(formatUnits(amount, 6)) // USDC/USDT ≈ $1 USD

  return (usdValue * 19.23).toLocaleString('es-MX', { // USD to MXN rate
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

function InvestmentCard({ tokenId }: { tokenId: number }) {
  const { data: investment, isLoading } = useInvestment(tokenId)
  const { data: progress } = useReturnProgress(tokenId)

  if (isLoading || !investment) {
    return (
      <Card className="animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-24 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const progressPercent = progress ? Number(progress) : 0
  const tierName = getTierName(investment.tier)
  const tokenSymbol = getTokenSymbol(investment.paymentToken)
  const investmentAmount = formatAmount(investment.investmentAmount, investment.paymentToken)
  const expectedReturn = formatAmount(investment.expectedReturn, investment.paymentToken)
  const currentReturn = formatAmount(investment.currentReturn, investment.paymentToken)
  const approxMXN = getApproxMXN(investment.investmentAmount, investment.paymentToken)

  // Colores por tier
  const tierColors = {
    Platinum: 'from-purple-500 to-pink-600',
    Gold: 'from-yellow-500 to-orange-500',
    Silver: 'from-gray-400 to-gray-600',
    Bronze: 'from-orange-600 to-red-600',
  }

  const tierBgColors = {
    Platinum: 'bg-gradient-to-br from-purple-50 to-pink-50',
    Gold: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    Silver: 'bg-gradient-to-br from-gray-50 to-slate-50',
    Bronze: 'bg-gradient-to-br from-orange-50 to-red-50',
  }

  return (
    <Card className={`${tierBgColors[tierName] || 'bg-white'} border-2 border-gray-200 hover:border-brand-aqua/50 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative`}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 bg-gradient-to-r ${tierColors[tierName]} rounded-lg`}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-brand-dark">
                NFT #{tokenId}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Urbanika Investment</p>
            </div>
          </div>

          <Badge className={`bg-gradient-to-r ${tierColors[tierName]} text-white border-0 text-sm px-3 py-1 shadow-md`}>
            {tierName}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Investment Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-brand-aqua/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-brand-aqua" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Inversión</p>
            </div>
            <p className="text-lg font-bold text-brand-dark">
              {investmentAmount} {tokenSymbol}
            </p>
            <p className="text-xs text-gray-500 mt-1">≈ ${approxMXN} MXN</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Meta (1.5x)</p>
            </div>
            <p className="text-lg font-bold text-green-600">
              {expectedReturn} {tokenSymbol}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ≈ ${getApproxMXN(investment.expectedReturn, investment.paymentToken)} MXN
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-aqua" />
              <span className="text-sm font-medium text-gray-700">Progreso de Retorno</span>
            </div>
            <span className="text-lg font-bold text-brand-dark">{progressPercent}%</span>
          </div>

          <Progress
            value={progressPercent}
            className="h-3 bg-gray-200"
          />

          <div className="flex justify-between items-center mt-3">
            <div>
              <p className="text-xs text-gray-500">Recibido</p>
              <p className="text-sm font-bold text-brand-aqua">
                {currentReturn} {tokenSymbol}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Falta</p>
              <p className="text-sm font-bold text-orange-600">
                {formatAmount(investment.expectedReturn - investment.currentReturn, investment.paymentToken)} {tokenSymbol}
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            investment.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {investment.isActive ? (
              <>
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Activo - Generando retorno</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Completado - Meta alcanzada</span>
              </>
            )}
          </div>
        </div>

        {/* View on Explorer */}
        <Button
          variant="outline"
          size="sm"
          className="w-full border-brand-aqua/30 text-brand-aqua hover:bg-brand-aqua/10"
          onClick={() => window.open(`https://scrollscan.com/token/0x1F3B7B68627f8B9BFe3db1F4a419ee20226b4a1d?a=${tokenId}`, '_blank')}
        >
          Ver en Scrollscan
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function MyInvestments() {
  const { address, isConnected } = useAccount()
  const { data: tokenIds, isLoading } = useInvestorTokens(address)

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-brand-aqua/5 to-brand-yellow/5 border-2 border-brand-aqua/30 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-aqua/10 rounded-full mb-6">
            <Wallet className="h-8 w-8 text-brand-aqua" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-3">Conecta tu Wallet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Conecta tu wallet para ver y gestionar tus inversiones NFT de Urbanika
          </p>
          <Badge className="bg-brand-aqua/10 text-brand-aqua border-brand-aqua/30 text-sm px-4 py-2">
            Usa el botón "Connect Wallet" arriba
          </Badge>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4" />
                  <div className="h-24 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Target className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-3">Sin inversiones aún</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comienza tu viaje de inversión en casas regenerativas. Invierte desde $250 MXN y recibe retorno garantizado de 1.5x
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Badge className="bg-brand-aqua/10 text-brand-aqua border-brand-aqua/30 text-sm px-4 py-2">
              📊 Retorno: 1.5x
            </Badge>
            <Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-4 py-2">
              💰 Desde $250 MXN
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-sm px-4 py-2">
              🏠 45 casas en producción
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
            Mis Inversiones
          </h2>
          <p className="text-gray-600">
            Tienes <strong className="text-brand-aqua">{tokenIds.length}</strong> {tokenIds.length === 1 ? 'inversión activa' : 'inversiones activas'}
          </p>
        </div>

        <Badge className="bg-gradient-to-r from-brand-aqua to-brand-yellow text-white border-0 text-lg px-6 py-3 shadow-lg">
          {tokenIds.length} NFT{tokenIds.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokenIds.map((tokenId) => (
          <InvestmentCard key={tokenId?.toString() || String(tokenId)} tokenId={Number(tokenId)} />
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-brand-dark mb-2">¿Cómo funciona el retorno?</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Con cada casa Urbanika vendida, se distribuyen retornos entre todos los NFT holders activos.
                Recibirás pagos progresivos hasta alcanzar 1.5x tu inversión inicial. El tiempo de retorno depende
                de la velocidad de ventas (actualmente hay 45 casas en producción).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
