"use client"

import { useContractStats } from '@/hooks/web3/useUrbanikaNFT'
import { Card, CardContent } from '@/components/ui/card'
import { Users, TrendingUp, Home, Coins } from 'lucide-react'
import { formatEther } from 'viem'

/**
 * Componente que muestra estadísticas en tiempo real del contrato
 *
 * Uso:
 * <ContractStats />
 */

export function ContractStats() {
  const { data: stats, isLoading, error } = useContractStats()

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const statsData = [
    {
      label: 'Total Inversores',
      value: stats.totalSupply?.toString() || '0',
      icon: Users,
      color: 'text-brand-aqua',
    },
    {
      label: 'NFTs Activos',
      value: stats.activeNFTCount?.toString() || '0',
      icon: Home,
      color: 'text-brand-yellow',
    },
    {
      label: 'Total Invertido',
      value: stats.totalInvestmentAmount
        ? `${parseFloat(formatEther(stats.totalInvestmentAmount)).toLocaleString()} MXN`
        : '0 MXN',
      icon: Coins,
      color: 'text-green-600',
    },
    {
      label: 'Total Distribuido',
      value: stats.totalDistributed
        ? `${parseFloat(formatEther(stats.totalDistributed)).toLocaleString()} MXN`
        : '0 MXN',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-brand-dark">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
