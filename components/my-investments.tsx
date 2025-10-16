"use client"

import { useAccount } from 'wagmi'
import { useInvestorTokens, useInvestment, useReturnProgress } from '@/hooks/web3/useUrbanikaNFT'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getTierName } from '@/lib/web3/abi'
import { formatEther } from 'viem'

/**
 * Componente que muestra las inversiones NFT de un usuario
 *
 * Uso:
 * <MyInvestments />
 */

function InvestmentCard({ tokenId }: { tokenId: number }) {
  const { data: investment, isLoading } = useInvestment(tokenId)
  const { data: progress } = useReturnProgress(tokenId)

  if (isLoading || !investment) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    )
  }

  const progressPercent = progress ? Number(progress) : 0
  const tierName = getTierName(investment.tier)

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>NFT #{tokenId}</span>
          <span className={`text-sm px-3 py-1 rounded-full ${
            tierName === 'Platinum' ? 'bg-purple-100 text-purple-800' :
            tierName === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
            tierName === 'Silver' ? 'bg-gray-100 text-gray-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {tierName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Inversión</p>
            <p className="text-lg font-bold text-brand-dark">
              ${parseFloat(formatEther(investment.investmentAmount)).toLocaleString()} MXN
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Retorno Esperado</p>
            <p className="text-lg font-bold text-green-600">
              ${parseFloat(formatEther(investment.expectedReturn)).toLocaleString()} MXN
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progreso de Retorno</span>
            <span className="font-semibold text-brand-dark">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div>
          <p className="text-sm text-gray-600">Retorno Actual</p>
          <p className="text-xl font-bold text-brand-aqua">
            ${parseFloat(formatEther(investment.currentReturn)).toLocaleString()} MXN
          </p>
        </div>

        <div className={`text-sm px-3 py-2 rounded ${
          investment.isActive
            ? 'bg-green-50 text-green-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          Estado: {investment.isActive ? 'Activo' : 'Completado'}
        </div>
      </CardContent>
    </Card>
  )
}

export function MyInvestments() {
  const { address, isConnected } = useAccount()
  const { data: tokenIds, isLoading } = useInvestorTokens(address)

  if (!isConnected) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Conecta tu wallet para ver tus inversiones</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-48 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No tienes inversiones NFT aún</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark">
        Mis Inversiones ({tokenIds.length})
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokenIds.map((tokenId) => (
          <InvestmentCard key={tokenId?.toString() || String(tokenId)} tokenId={Number(tokenId)} />
        ))}
      </div>
    </div>
  )
}
