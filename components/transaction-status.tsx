'use client'

import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'

/**
 * Transaction Status Tracker
 *
 * Trackea el estado de una transacción en tiempo real y muestra
 * mensajes apropiados al usuario.
 *
 * Features:
 * - Real-time transaction tracking
 * - Explorer links
 * - Success/Error states
 * - Estimated time
 * - Retry on failure
 */

interface TransactionStatusProps {
  hash?: `0x${string}`
  onSuccess?: () => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function TransactionStatus({
  hash,
  onSuccess,
  onError,
  successMessage = '¡Transacción completada con éxito!',
  errorMessage = 'La transacción falló',
}: TransactionStatusProps) {
  const chainId = useChainId()
  const [showStatus, setShowStatus] = useState(false)

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Mostrar status cuando hay hash
  useEffect(() => {
    if (hash) {
      setShowStatus(true)
    }
  }, [hash])

  // Handle success
  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  // Handle error
  useEffect(() => {
    if (isError && onError && error) {
      onError(error)
    }
  }, [isError, onError, error])

  // No mostrar nada si no hay hash
  if (!hash || !showStatus) return null

  // Explorer URL (always Scroll Mainnet)
  const explorerUrl = `https://scrollscan.com/tx/${hash}`

  // Pending state
  if (isPending) {
    return (
      <Alert className="border-blue-500 bg-blue-50">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <AlertTitle className="text-blue-900">Procesando transacción...</AlertTitle>
        <AlertDescription className="text-blue-800">
          <p className="mb-2">Tu transacción está siendo confirmada en la blockchain.</p>
          <p className="text-sm opacity-75 mb-3">
            Esto puede tomar de 10 a 30 segundos. No cierres esta ventana.
          </p>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 underline"
          >
            Ver en explorador
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </AlertDescription>
      </Alert>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-900">{successMessage}</AlertTitle>
        <AlertDescription className="text-green-800">
          <p className="mb-3">Tu transacción fue confirmada exitosamente.</p>
          <div className="flex gap-3">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 underline"
            >
              Ver en explorador
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <Button
              onClick={() => setShowStatus(false)}
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm text-green-700 hover:text-green-900"
            >
              Cerrar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive" className="border-red-500">
        <XCircle className="h-5 w-5" />
        <AlertTitle>{errorMessage}</AlertTitle>
        <AlertDescription>
          <p className="mb-3">
            {error?.message || 'Ocurrió un error al procesar tu transacción.'}
          </p>
          <div className="flex gap-3">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium underline"
            >
              Ver en explorador
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <Button
              onClick={() => setShowStatus(false)}
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm"
            >
              Cerrar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

/**
 * Hook para trackear transacciones con callbacks
 */
export function useTransactionTracker(hash?: `0x${string}`) {
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    receipt,
    isPending,
    isSuccess,
    isError,
    error,
    // Helpers
    isConfirming: isPending,
    isConfirmed: isSuccess,
    confirmations: receipt?.confirmations,
  }
}
