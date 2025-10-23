import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import { URBANIKA_NFT_ABI } from '@/lib/web3/abi'
import { getContractAddress } from '@/lib/web3/config'
import type { SupportedToken } from '@/lib/web3/tokens'

/**
 * Hook para mintear NFT con pago directo en ETH
 */
export function useMintNFT(chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534352) as `0x${string}`

  // Escribir en el contrato
  const {
    data: hash,
    writeContract,
    isPending,
    error,
  } = useWriteContract()

  // Esperar confirmación de transacción
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Mintea un NFT pagando en ETH
   * @param investmentAmount - Monto de inversión en MXN
   * @param tokenURI - URI del metadata en IPFS
   * @param priceInWei - Precio calculado desde el contrato (en wei)
   */
  const mintNFT = async ({
    investmentAmount,
    tokenURI,
    priceInWei,
  }: {
    investmentAmount: number // en MXN
    tokenURI: string
    priceInWei: bigint // Precio desde calculatePrice del contrato
  }) => {
    // Convertir MXN a wei
    const investmentAmountWei = parseEther(investmentAmount.toString())

    console.log('🔧 useMintNFT.mintNFT called with:', {
      investmentAmount,
      investmentAmountWei: investmentAmountWei.toString(),
      tokenURI,
      priceInWei: priceInWei.toString(),
      contractAddress,
    })

    try {
      console.log('📝 Calling writeContract for ETH mint...')
      const result = await writeContract({
        address: contractAddress,
        abi: URBANIKA_NFT_ABI,
        functionName: 'publicMint',
        args: [investmentAmountWei, tokenURI],
        value: priceInWei, // Usar precio del contrato
      })
      console.log('✅ writeContract completed, result:', result)
      return result
    } catch (err) {
      console.error('❌ Error minteando NFT:', err)
      throw err
    }
  }

  /**
   * Mintea un NFT pagando con un token ERC20 (USDC o USDT)
   * @param investmentAmount - Monto de inversión en MXN
   * @param tokenURI - URI del metadata en IPFS
   * @param tokenAddress - Dirección del token ERC20
   */
  const mintNFTWithToken = async ({
    investmentAmount,
    tokenURI,
    tokenAddress,
  }: {
    investmentAmount: number // en MXN
    tokenURI: string
    tokenAddress: string // Dirección del token (USDC o USDT)
  }) => {
    // Convertir MXN a wei
    const investmentAmountWei = parseEther(investmentAmount.toString())

    console.log('🔧 useMintNFT.mintNFTWithToken called with:', {
      investmentAmount,
      investmentAmountWei: investmentAmountWei.toString(),
      tokenURI,
      tokenAddress,
      contractAddress,
    })

    try {
      console.log('📝 Calling writeContract...')
      const result = await writeContract({
        address: contractAddress,
        abi: URBANIKA_NFT_ABI,
        functionName: 'publicMintWithToken',
        args: [investmentAmountWei, tokenURI, tokenAddress as `0x${string}`],
        // No se envía value porque el pago es en ERC20
      })
      console.log('✅ writeContract completed, result:', result)
      return result
    } catch (err) {
      console.error('❌ Error minteando NFT con token:', err)
      throw err
    }
  }

  return {
    mintNFT,
    mintNFTWithToken,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook para calcular el precio de un NFT
 */
export function useCalculatePrice(investmentAmount: number, chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534352) as `0x${string}`

  // Validar que investmentAmount sea un número válido
  const isValidAmount = investmentAmount && !isNaN(investmentAmount) && investmentAmount > 0
  const investmentAmountWei = isValidAmount ? parseEther(investmentAmount.toString()) : parseEther('0')

  return useReadContract({
    address: contractAddress,
    abi: URBANIKA_NFT_ABI,
    functionName: 'calculatePrice',
    args: [investmentAmountWei],
    query: {
      enabled: isValidAmount, // Solo ejecutar si el monto es válido
    },
  })
}

/**
 * Hook para calcular el precio en un token específico (ETH, USDC, USDT)
 */
export function useCalculatePriceInToken(
  investmentAmount: number,
  tokenAddress: string,
  chainId?: number
) {
  const contractAddress = getContractAddress(chainId || 534352) as `0x${string}`

  // Validar que investmentAmount sea un número válido
  const isValidAmount = investmentAmount && !isNaN(investmentAmount) && investmentAmount > 0
  const investmentAmountWei = isValidAmount ? parseEther(investmentAmount.toString()) : parseEther('0')

  return useReadContract({
    address: contractAddress,
    abi: URBANIKA_NFT_ABI,
    functionName: 'calculatePriceInToken',
    args: [investmentAmountWei, tokenAddress as `0x${string}`],
    query: {
      enabled: isValidAmount && !!tokenAddress, // Solo ejecutar si el monto y token son válidos
    },
  })
}

/**
 * Hook para obtener el precio por unidad en ETH
 */
export function usePricePerUnit(chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534352) as `0x${string}`

  return useReadContract({
    address: contractAddress,
    abi: URBANIKA_NFT_ABI,
    functionName: 'pricePerUnit',
  })
}

/**
 * Hook para obtener el precio de un token ERC20 por unidad
 */
export function useTokenPricePerUnit(tokenAddress: string, chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534352) as `0x${string}`

  return useReadContract({
    address: contractAddress,
    abi: URBANIKA_NFT_ABI,
    functionName: 'tokenPricePerUnit',
    args: [tokenAddress as `0x${string}`],
    query: {
      enabled: !!tokenAddress,
    },
  })
}
