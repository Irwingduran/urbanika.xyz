import { useReadContract, useReadContracts } from 'wagmi'
import { URBANIKA_NFT_ABI, type Investment } from '@/lib/web3/abi'
import { getContractAddress } from '@/lib/web3/config'

/**
 * Hook para leer datos del contrato UrbanikaNFT
 */

export function useUrbanikaNFT(chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534351) as `0x${string}`

  return {
    contractAddress,
    abi: URBANIKA_NFT_ABI,
  }
}

/**
 * Hook para obtener información de una inversión
 */
export function useInvestment(tokenId: number, chainId?: number) {
  const { contractAddress, abi } = useUrbanikaNFT(chainId)

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getInvestment',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  })
}

/**
 * Hook para obtener el progreso de retorno de una inversión
 */
export function useReturnProgress(tokenId: number, chainId?: number) {
  const { contractAddress, abi } = useUrbanikaNFT(chainId)

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getReturnProgress',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  })
}

/**
 * Hook para obtener todos los NFTs de un inversor
 */
export function useInvestorTokens(investorAddress?: string, chainId?: number) {
  const { contractAddress, abi } = useUrbanikaNFT(chainId)

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getInvestorTokens',
    args: investorAddress ? [investorAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!investorAddress,
    },
  })
}

/**
 * Hook para obtener estadísticas generales del contrato
 */
export function useContractStats(chainId?: number) {
  const { contractAddress, abi } = useUrbanikaNFT(chainId)

  const result = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi,
        functionName: 'totalSupply',
      },
      {
        address: contractAddress,
        abi,
        functionName: 'getActiveNFTCount',
      },
      {
        address: contractAddress,
        abi,
        functionName: 'totalInvestmentAmount',
      },
      {
        address: contractAddress,
        abi,
        functionName: 'totalDistributed',
      },
    ],
  })

  return {
    ...result,
    data: result.data
      ? {
          totalSupply: result.data[0].result as bigint,
          activeNFTCount: result.data[1].result as bigint,
          totalInvestmentAmount: result.data[2].result as bigint,
          totalDistributed: result.data[3].result as bigint,
        }
      : undefined,
  }
}

/**
 * Hook para verificar si un usuario es dueño de un NFT
 */
export function useNFTOwner(tokenId: number, chainId?: number) {
  const { contractAddress, abi } = useUrbanikaNFT(chainId)

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  })
}

/**
 * Hook para obtener el nombre y símbolo del contrato
 */
export function useContractInfo(chainId?: number) {
  const { contractAddress, abi } = useUrbanikaNFT(chainId)

  const result = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi,
        functionName: 'name',
      },
      {
        address: contractAddress,
        abi,
        functionName: 'symbol',
      },
    ],
  })

  return {
    ...result,
    data: result.data
      ? {
          name: result.data[0].result as string,
          symbol: result.data[1].result as string,
        }
      : undefined,
  }
}
