'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { scroll } from 'wagmi/chains'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'

/**
 * NetworkChecker Component
 *
 * Detecta si el usuario está en Scroll Mainnet y ofrece
 * cambiar automáticamente con un click.
 *
 * Features:
 * - Auto-detecta red actual
 * - Muestra alerta si está en red incorrecta
 * - Botón para cambiar de red automáticamente
 * - Maneja estados de loading
 */
export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending, isError } = useSwitchChain()

  // Siempre usa Scroll Mainnet
  const requiredChain = scroll
  const requiredChainId = requiredChain.id
  const requiredChainName = requiredChain.name

  // Si no está conectado, no mostrar nada
  if (!isConnected) return null

  // Si está en la red correcta, no mostrar nada
  if (chainId === requiredChainId) return null

  // Usuario está en red incorrecta
  return (
    <Alert variant="destructive" className="mb-6 border-2">
      <AlertTriangle className="h-5 w-5" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ml-2">
        <div>
          <p className="font-semibold">Red incorrecta detectada</p>
          <p className="text-sm opacity-90">
            Por favor cambia a <span className="font-bold">{requiredChainName}</span> para continuar
          </p>
        </div>

        <Button
          onClick={() => switchChain({ chainId: requiredChainId })}
          disabled={isPending}
          variant="outline"
          size="sm"
          className="bg-white text-red-600 hover:bg-red-50 border-white flex-shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cambiando...
            </>
          ) : (
            `Cambiar a ${requiredChainName}`
          )}
        </Button>
      </AlertDescription>

      {isError && (
        <p className="text-xs mt-2 ml-7 opacity-75">
          Si no puedes cambiar automáticamente, cambia la red manualmente en tu wallet.
        </p>
      )}
    </Alert>
  )
}
