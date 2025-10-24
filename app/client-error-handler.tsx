'use client'

import { useEffect } from 'react'

/**
 * Componente para manejar errores del cliente que no afectan la funcionalidad
 * Específicamente errores de extensiones del navegador
 */
export function ClientErrorHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Handler para errores no controlados
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message?.toLowerCase() || ''

      // Ignorar errores conocidos de extensiones
      const extensionErrors = [
        'could not establish connection',
        'receiving end does not exist',
        'extension context invalidated',
        'message port closed',
        'non-existent id',
      ]

      if (extensionErrors.some(err => errorMessage.includes(err))) {
        event.preventDefault() // Prevenir que se muestre en consola
        return
      }
    }

    // Handler para rechazos de promesas no controladas
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message?.toLowerCase() || event.reason?.toString().toLowerCase() || ''

      if (
        reason.includes('could not establish connection') ||
        reason.includes('receiving end does not exist')
      ) {
        event.preventDefault()
        return
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return null
}