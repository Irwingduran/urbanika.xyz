import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { URBANIKA_NFT_ABI } from '@/lib/web3/abi'
import { getContractAddress } from '@/lib/web3/config'

/**
 * Hook para mintear NFT con pago directo en ETH o tokens
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
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isTransactionError,
    error: transactionError,
    status: transactionStatus,
  } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Mintea un NFT pagando en ETH
   * @param tokenURI - URI del metadata en IPFS
   * @param ethAmount - Cantidad de ETH a enviar (en wei)
   */
  const mintNFT = async ({
    tokenURI,
    ethAmount,
  }: {
    tokenURI: string
    ethAmount: bigint // Cantidad de ETH en wei
  }) => {
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: URBANIKA_NFT_ABI,
        functionName: 'publicMintWithETH',
        args: [tokenURI],
        value: ethAmount, // ETH que se envía
      })
      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * Mintea un NFT pagando con un token ERC20 (USDC o USDT)
   * @param tokenAmount - Cantidad de tokens en unidades base (ej: 10 USDC = 10 * 10^6)
   * @param tokenURI - URI del metadata en IPFS
   * @param tokenAddress - Dirección del token ERC20
   */
  const mintNFTWithToken = async ({
    tokenAmount,
    tokenURI,
    tokenAddress,
  }: {
    tokenAmount: bigint // Cantidad de tokens en unidades base
    tokenURI: string
    tokenAddress: string
  }) => {
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: URBANIKA_NFT_ABI,
        functionName: 'publicMintWithToken',
        args: [tokenAmount, tokenURI, tokenAddress as `0x${string}`],
        // No se envía value porque el pago es en ERC20
      })
      return result
    } catch (err) {
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
    isTransactionError,
    transactionError,
    transactionStatus,
    error, // Error de writeContract
  }
}
