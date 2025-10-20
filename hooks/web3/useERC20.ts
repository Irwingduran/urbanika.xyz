import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ERC20_ABI } from '@/lib/web3/tokens'
import { parseUnits } from 'viem'

/**
 * Hook para interactuar con tokens ERC20 (USDC, USDT)
 */
export function useERC20Token(tokenAddress: string, spenderAddress: string) {
  const { address: userAddress } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Leer balance del usuario
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress,
    },
  })

  // Leer allowance (cuánto puede gastar el contrato)
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress && spenderAddress ? [userAddress, spenderAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress && !!spenderAddress,
    },
  })

  // Función para aprobar gasto
  const approve = async (amount: string, decimals: number = 6) => {
    if (!tokenAddress || !spenderAddress) {
      throw new Error('Token address or spender address not provided')
    }

    const amountInWei = parseUnits(amount, decimals)

    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress as `0x${string}`, amountInWei],
    })
  }

  // Refrescar datos después de una transacción exitosa
  useEffect(() => {
    if (isSuccess) {
      refetchBalance()
      refetchAllowance()
    }
  }, [isSuccess, refetchBalance, refetchAllowance])

  return {
    balance: balance as bigint | undefined,
    allowance: allowance as bigint | undefined,
    approve,
    approveHash: hash,
    isApproving: isPending,
    isConfirmingApproval: isConfirming,
    isApproveSuccess: isSuccess,
    approveError: error,
    refetchBalance,
    refetchAllowance,
  }
}

/**
 * Hook para verificar si hay suficiente allowance
 */
export function useHasSufficientAllowance(
  tokenAddress: string,
  spenderAddress: string,
  requiredAmount: bigint
) {
  const { allowance } = useERC20Token(tokenAddress, spenderAddress)

  return {
    hasSufficientAllowance: allowance ? allowance >= requiredAmount : false,
    currentAllowance: allowance,
  }
}
