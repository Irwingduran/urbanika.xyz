"use client"

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'

/**
 * Componente para conectar/desconectar wallet
 *
 * Uso:
 * <WalletConnectButton />
 */

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Desconectar</span>
        </Button>
      </div>
    )
  }

  // Usar el primer conector disponible (generalmente injected/MetaMask)
  const defaultConnector = connectors[0]

  return (
    <Button
      onClick={() => connect({ connector: defaultConnector })}
      disabled={isPending || !defaultConnector}
      className="gap-2 bg-brand-aqua hover:bg-brand-aqua/90"
    >
      <Wallet className="h-4 w-4" />
      {isPending ? 'Conectando...' : 'Conectar Wallet'}
    </Button>
  )
}
