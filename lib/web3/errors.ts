/**
 * Web3 Error Handler
 *
 * Convierte errores técnicos de Web3 en mensajes amigables para usuarios.
 * Soporta errores de Wagmi, Viem, Metamask, y contratos.
 */

export type Web3ErrorType =
  | 'user_rejected'
  | 'insufficient_funds'
  | 'network_error'
  | 'contract_error'
  | 'wallet_not_connected'
  | 'wrong_network'
  | 'transaction_failed'
  | 'unknown'

export interface ParsedError {
  type: Web3ErrorType
  title: string
  message: string
  action?: string
  technicalDetails?: string
}

/**
 * Parser principal de errores Web3
 */
export function parseWeb3Error(error: any): ParsedError {
  const errorString = error?.toString?.() || ''
  const errorMessage = error?.message || errorString
  const errorCode = error?.code

  // User rejected transaction
  if (
    errorCode === 4001 ||
    errorCode === 'ACTION_REJECTED' ||
    errorMessage.includes('User rejected') ||
    errorMessage.includes('User denied') ||
    errorMessage.includes('user rejected')
  ) {
    return {
      type: 'user_rejected',
      title: 'Transacción cancelada',
      message: 'Rechazaste la transacción en tu wallet.',
      action: 'Intenta nuevamente cuando estés listo.',
    }
  }

  // Insufficient funds
  if (
    errorMessage.includes('insufficient funds') ||
    errorMessage.includes('insufficient balance')
  ) {
    return {
      type: 'insufficient_funds',
      title: 'Fondos insuficientes',
      message: 'No tienes suficiente ETH para completar esta transacción.',
      action: 'Agrega más ETH a tu wallet e intenta de nuevo.',
    }
  }

  // Wrong network
  if (
    errorMessage.includes('chain') ||
    errorMessage.includes('network')
  ) {
    return {
      type: 'wrong_network',
      title: 'Red incorrecta',
      message: 'Por favor cambia a Scroll Sepolia en tu wallet.',
      action: 'Usa el botón "Cambiar Red" arriba.',
    }
  }

  // Wallet not connected
  if (
    errorMessage.includes('not connected') ||
    errorMessage.includes('No account')
  ) {
    return {
      type: 'wallet_not_connected',
      title: 'Wallet no conectada',
      message: 'Necesitas conectar tu wallet para continuar.',
      action: 'Haz click en "Conectar Wallet" arriba.',
    }
  }

  // Contract specific errors
  if (errorMessage.includes('Minting is paused')) {
    return {
      type: 'contract_error',
      title: 'Minteo pausado',
      message: 'El minteo de NFTs está temporalmente pausado.',
      action: 'Por favor intenta más tarde o contacta a soporte.',
      technicalDetails: errorMessage,
    }
  }

  if (errorMessage.includes('Investment amount too low')) {
    return {
      type: 'contract_error',
      title: 'Monto muy bajo',
      message: 'El monto de inversión no alcanza el mínimo requerido.',
      action: 'Aumenta el monto de inversión.',
      technicalDetails: errorMessage,
    }
  }

  if (errorMessage.includes('MAX_SUPPLY')) {
    return {
      type: 'contract_error',
      title: 'Límite alcanzado',
      message: 'Se alcanzó el límite máximo de NFTs disponibles.',
      action: 'Ya no hay más NFTs disponibles para mintear.',
      technicalDetails: errorMessage,
    }
  }

  // Transaction failed
  if (
    errorMessage.includes('transaction failed') ||
    errorMessage.includes('execution reverted')
  ) {
    return {
      type: 'transaction_failed',
      title: 'Transacción fallida',
      message: 'La transacción no pudo completarse.',
      action: 'Revisa los detalles e intenta nuevamente.',
      technicalDetails: errorMessage,
    }
  }

  // Network/RPC errors
  if (
    errorMessage.includes('fetch') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('network')
  ) {
    return {
      type: 'network_error',
      title: 'Error de conexión',
      message: 'No pudimos conectar con la red blockchain.',
      action: 'Verifica tu conexión a internet e intenta de nuevo.',
      technicalDetails: errorMessage,
    }
  }

  // Unknown error
  return {
    type: 'unknown',
    title: 'Error inesperado',
    message: 'Ocurrió un error que no pudimos identificar.',
    action: 'Por favor intenta nuevamente o contacta a soporte.',
    technicalDetails: errorMessage,
  }
}

/**
 * Helper para logging de errores (útil para debugging y analytics)
 */
export function logWeb3Error(error: any, context?: string) {
  const parsed = parseWeb3Error(error)

  console.error('🚨 Web3 Error:', {
    context,
    type: parsed.type,
    title: parsed.title,
    message: parsed.message,
    technicalDetails: parsed.technicalDetails,
    originalError: error,
  })

  // Aquí puedes agregar analytics (Sentry, Mixpanel, etc.)
  // Example: Sentry.captureException(error, { tags: { type: parsed.type } })
}

/**
 * Helper para mostrar errores en toast/alert
 */
export function getErrorDisplay(error: any): { title: string; description: string } {
  const parsed = parseWeb3Error(error)

  return {
    title: parsed.title,
    description: `${parsed.message} ${parsed.action || ''}`.trim(),
  }
}
