"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInvestmentTiers } from '@/hooks/web3/useETHPrice'
import { Loader2, TrendingUp } from 'lucide-react'

/**
 * Componente que muestra los tiers de inversión con precios dinámicos
 * Usa el Oracle de Chainlink para mostrar los equivalentes en ETH
 */
export function InvestmentTiers() {
  const { tiers, priceInUSD } = useInvestmentTiers()

  if (!priceInUSD) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-aqua" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Niveles de Inversión</span>
          <span className="text-sm font-normal text-gray-600">
            ETH: ${priceInUSD.toFixed(2)} USD
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border-2 ${tier.borderColor} ${tier.bgColor} hover:shadow-md transition-shadow`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{tier.emoji}</div>
                <h4 className={`font-bold ${tier.color} mb-1`}>{tier.name}</h4>
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-gray-700">
                    {tier.maxUSD
                      ? `$${tier.minUSD} - $${tier.maxUSD}`
                      : `≥ $${tier.minUSD}`} USD
                  </p>
                  <p className="text-gray-600">
                    {tier.maxETH
                      ? `${tier.minETH.toFixed(4)} - ${tier.maxETH.toFixed(4)}`
                      : `≥ ${tier.minETH.toFixed(4)}`} ETH
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Retorno Esperado: 1.5x</p>
              <p className="text-xs">
                Todos los inversores reciben un retorno del 150% de su inversión inicial,
                independientemente del tier.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Componente compacto para mostrar el tier actual de una inversión
 */
export function TierBadge({ amount }: { amount: number }) {
  const { getTierForAmount } = useInvestmentTiers()
  const tier = getTierForAmount(amount)

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tier.bgColor} ${tier.color} ${tier.borderColor} border`}
    >
      <span className="mr-1">{tier.emoji}</span>
      {tier.name}
    </span>
  )
}