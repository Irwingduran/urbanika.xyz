'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { scroll } from 'wagmi/chains'
import { Button } from '@/components/ui/button'
import { Network, Loader2, CheckCircle2 } from 'lucide-react'

/**
 * NetworkSwitchButton Component
 *
 * Botón siempre visible para cambiar a Scroll Mainnet
 * Muestra estado de la red actual y permite cambiar con un click
 */

interface NetworkSwitchButtonProps {
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function NetworkSwitchButton({
  variant = 'outline',
  size = 'default',
  className = ''
}: NetworkSwitchButtonProps) {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  // Si no está conectado, no mostrar
  if (!isConnected) return null

  const isOnScrollMainnet = chainId === scroll.id
  const currentChainName = isOnScrollMainnet ? 'Scroll Mainnet' : `Chain ${chainId}`

  // Si ya está en Scroll Mainnet
  if (isOnScrollMainnet) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={`${className} border-green-500 text-green-700 bg-green-50 cursor-default`}
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Conectado a Scroll Mainnet
      </Button>
    )
  }

  // Si está en otra red
  return (
    <Button
      onClick={() => switchChain({ chainId: scroll.id })}
      disabled={isPending}
      variant={variant}
      size={size}
      className={`${className} border-orange-500 text-orange-700 hover:bg-orange-50`}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cambiando a Scroll Mainnet...
        </>
      ) : (
        <>
          <Network className="mr-2 h-4 w-4" />
          Cambiar a Scroll Mainnet
        </>
      )}
    </Button>
  )
}
