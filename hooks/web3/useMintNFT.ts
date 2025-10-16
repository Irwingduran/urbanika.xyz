import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import { URBANIKA_NFT_ABI } from '@/lib/web3/abi'
import { getContractAddress } from '@/lib/web3/config'

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

    try {
      await writeContract({
        address: contractAddress,
        abi: URBANIKA_NFT_ABI,
        functionName: 'publicMint',
        args: [investmentAmountWei, tokenURI],
        value: priceInWei, // Usar precio del contrato
      })
    } catch (err) {
      console.error('Error minteando NFT:', err)
      throw err
    }
  }

  return {
    mintNFT,
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
 * Hook para obtener el precio por unidad
 */
export function usePricePerUnit(chainId?: number) {
  const contractAddress = getContractAddress(chainId || 534352) as `0x${string}`

  return useReadContract({
    address: contractAddress,
    abi: URBANIKA_NFT_ABI,
    functionName: 'pricePerUnit',
  })
}
