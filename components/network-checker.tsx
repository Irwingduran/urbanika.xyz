'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { scroll, scrollSepolia } from 'wagmi/chains'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2, Info } from 'lucide-react'

/**
 * NetworkChecker Component
 *
 * Detecta si el usuario está en Scroll (Mainnet o Sepolia) y ofrece
 * cambiar automáticamente con un click.
 *
 * Features:
 * - Auto-detecta red actual
 * - Muestra alerta si está en red incorrecta
 * - Acepta tanto Scroll Mainnet como Scroll Sepolia
 * - Botón para cambiar de red automáticamente
 * - Maneja estados de loading
 */

// Redes soportadas
const SUPPORTED_CHAINS = [scroll, scrollSepolia] as const
const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map(chain => chain.id)

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending, isError } = useSwitchChain()

  // Si no está conectado, no mostrar nada
  if (!isConnected) return null

  // Si está en una red correcta, mostrar información
  const isOnSupportedChain = SUPPORTED_CHAIN_IDS.includes(chainId)

  if (isOnSupportedChain) {
    const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId)
    const isTestnet = chainId === scrollSepolia.id

    if (isTestnet) {
      return (
        <Alert className="mb-6 border-2 border-blue-500 bg-blue-50">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ml-2">
            <div>
              <p className="font-semibold text-blue-900">Modo Testnet</p>
              <p className="text-sm text-blue-800">
                Estás en <span className="font-bold">{currentChain?.name}</span>. Perfecto para pruebas sin gastar dinero real.
              </p>
            </div>
            <Button
              onClick={() => switchChain({ chainId: scroll.id })}
              disabled={isPending}
              variant="outline"
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 border-blue-300 flex-shrink-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cambiando...
                </>
              ) : (
                `Cambiar a Mainnet`
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    // Si está en mainnet, no mostrar nada
    return null
  }

  // Usuario está en red incorrecta
  return (
    <Alert variant="destructive" className="mb-6 border-2">
      <AlertTriangle className="h-5 w-5" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ml-2">
        <div>
          <p className="font-semibold">Red incorrecta detectada</p>
          <p className="text-sm opacity-90">
            Por favor cambia a <span className="font-bold">Scroll Mainnet</span> o <span className="font-bold">Scroll Sepolia</span> para continuar
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={() => switchChain({ chainId: scroll.id })}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="bg-white text-red-600 hover:bg-red-50 border-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cambiando...
              </>
            ) : (
              'Mainnet'
            )}
          </Button>
          <Button
            onClick={() => switchChain({ chainId: scrollSepolia.id })}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 border-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cambiando...
              </>
            ) : (
              'Sepolia (Testnet)'
            )}
          </Button>
        </div>
      </AlertDescription>

      {isError && (
        <p className="text-xs mt-2 ml-7 opacity-75">
          Si no puedes cambiar automáticamente, cambia la red manualmente en tu wallet.
        </p>
      )}
    </Alert>
  )
}
