/**
 * Helper functions to parse and display user-friendly blockchain transaction errors
 */

export type TransactionErrorType =
  | 'insufficient_balance'
  | 'insufficient_allowance'
  | 'user_rejected'
  | 'gas_too_low'
  | 'contract_reverted'
  | 'unknown'

export interface ParsedTransactionError {
  type: TransactionErrorType
  message: string
  userMessage: string
  technicalDetails?: string
}

/**
 * Parse transaction error and return user-friendly message
 */
export function parseTransactionError(error: any): ParsedTransactionError {
  const errorMessage = error?.message || error?.toString() || ''
  const errorLower = errorMessage.toLowerCase()

  // User rejected transaction
  if (
    errorLower.includes('user rejected') ||
    errorLower.includes('user denied') ||
    errorLower.includes('user cancelled')
  ) {
    return {
      type: 'user_rejected',
      message: errorMessage,
      userMessage: 'Transacción cancelada. Rechazaste la transacción en tu wallet.',
    }
  }

  // Insufficient balance (ETH or tokens)
  if (
    errorLower.includes('insufficient funds') ||
    errorLower.includes('insufficient balance') ||
    errorLower.includes('exceeds balance')
  ) {
    return {
      type: 'insufficient_balance',
      message: errorMessage,
      userMessage:
        'No tienes suficiente saldo. Verifica que tengas suficiente USDC/USDT o ETH para pagar el NFT y las fees de gas.',
      technicalDetails: errorMessage,
    }
  }

  // Insufficient allowance
  if (
    errorLower.includes('allowance') ||
    errorLower.includes('erc20: transfer amount exceeds allowance') ||
    errorLower.includes('insufficient allowance')
  ) {
    return {
      type: 'insufficient_allowance',
      message: errorMessage,
      userMessage:
        'El permiso de gasto del token no es suficiente. Por favor aprueba de nuevo con un monto mayor.',
      technicalDetails: errorMessage,
    }
  }

  // Gas too low
  if (
    errorLower.includes('gas') &&
    (errorLower.includes('too low') || errorLower.includes('intrinsic gas'))
  ) {
    return {
      type: 'gas_too_low',
      message: errorMessage,
      userMessage: 'El gas estimado es demasiado bajo. Por favor intenta de nuevo.',
      technicalDetails: errorMessage,
    }
  }

  // Contract execution reverted (generic)
  if (
    errorLower.includes('execution reverted') ||
    errorLower.includes('revert') ||
    errorLower.includes('transaction failed')
  ) {
    return {
      type: 'contract_reverted',
      message: errorMessage,
      userMessage:
        'La transacción fue rechazada por el contrato. Posibles causas: balance insuficiente, allowance insuficiente, o precio incorrecto.',
      technicalDetails: errorMessage,
    }
  }

  // Unknown error
  return {
    type: 'unknown',
    message: errorMessage,
    userMessage: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
    technicalDetails: errorMessage,
  }
}

/**
 * Get troubleshooting steps based on error type
 */
export function getTroubleshootingSteps(errorType: TransactionErrorType): string[] {
  switch (errorType) {
    case 'insufficient_balance':
      return [
        'Verifica tu balance de USDC/USDT en tu wallet',
        'Asegúrate de tener suficiente ETH para pagar el gas',
        'Intenta con un monto de inversión menor',
      ]

    case 'insufficient_allowance':
      return [
        'Haz clic en "Aprobar gasto de tokens" nuevamente',
        'Aprueba un monto mayor (ej: el doble del monto de inversión)',
        'Espera a que se confirme la aprobación antes de continuar',
      ]

    case 'user_rejected':
      return ['Vuelve a intentar la compra', 'Aprueba la transacción en tu wallet cuando aparezca']

    case 'gas_too_low':
      return ['Aumenta el gas limit en tu wallet', 'Intenta de nuevo en unos minutos']

    case 'contract_reverted':
      return [
        'Verifica que tengas suficiente USDC/USDT',
        'Verifica que hayas aprobado el gasto de tokens',
        'Intenta refrescar la página y volver a empezar',
      ]

    default:
      return [
        'Refresca la página e intenta de nuevo',
        'Verifica tu conexión a internet',
        'Si el problema persiste, contacta soporte',
      ]
  }
}
