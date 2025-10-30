import { useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { getContractAddress } from '@/lib/web3/config'
import { URBANIKA_NFT_ABI } from '@/lib/web3/abi'

/**
 * Hook para obtener el precio actual de ETH en USD desde el Oracle de Chainlink
 * @param chainId - ID de la cadena (opcional, usa Scroll Mainnet por defecto)
 * @returns Precio de ETH en USD y estado de carga
 */
export function useETHPrice(chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534352)

  const { data, isLoading, isError, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: URBANIKA_NFT_ABI,
    functionName: 'getETHPriceUSD',
    chainId: chainId || 534352,
  })

  // Convertir el precio de 18 decimales a número legible
  const priceInUSD = data ? Number(formatUnits(data as bigint, 18)) : 0

  return {
    priceInUSD,
    isLoading,
    isError,
    error,
    // Helper para calcular cuánto ETH necesitas para un monto en USD (retorna BigInt en wei)
    getETHAmount: (usdAmount: number): bigint => {
      if (!priceInUSD || priceInUSD === 0) return BigInt(0)
      const ethAmount = usdAmount / priceInUSD
      // Convertir a wei (BigInt) usando parseUnits con 18 decimales
      return parseUnits(ethAmount.toFixed(18), 18)
    },
    // Helper para obtener ETH como número decimal (para display)
    getETHAmountDecimal: (usdAmount: number): number => {
      if (!priceInUSD || priceInUSD === 0) return 0
      return usdAmount / priceInUSD
    },
    // Helper para formatear el precio
    formattedPrice: priceInUSD ? `$${priceInUSD.toFixed(2)}` : '$0.00'
  }
}

/**
 * Hook para obtener información de los tiers basada en el precio actual
 */
export function useInvestmentTiers() {
  const { priceInUSD, getETHAmountDecimal } = useETHPrice()

  const tiers = [
    {
      name: 'Bronze',
      emoji: '🥉',
      minUSD: 0,
      maxUSD: 25,
      minETH: 0,
      maxETH: getETHAmountDecimal(25),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      name: 'Silver',
      emoji: '🥈',
      minUSD: 25,
      maxUSD: 250,
      minETH: getETHAmountDecimal(25),
      maxETH: getETHAmountDecimal(250),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      name: 'Gold',
      emoji: '🥇',
      minUSD: 250,
      maxUSD: 500,
      minETH: getETHAmountDecimal(250),
      maxETH: getETHAmountDecimal(500),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Platinum',
      emoji: '💎',
      minUSD: 500,
      maxUSD: null,
      minETH: getETHAmountDecimal(500),
      maxETH: null,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const getTierForAmount = (amountUSD: number) => {
    if (amountUSD < 25) return tiers[0] // Bronze
    if (amountUSD < 250) return tiers[1] // Silver
    if (amountUSD < 500) return tiers[2] // Gold
    return tiers[3] // Platinum
  }

  return {
    tiers,
    getTierForAmount,
    priceInUSD
  }
}