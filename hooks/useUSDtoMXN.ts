'use client'

import { useState, useEffect } from 'react'

interface ExchangeRateData {
  rate: number
  timestamp: number
}

interface UseUSDtoMXNReturn {
  usdToMxn: number
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
}

const CACHE_KEY = 'usd_to_mxn_cache'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora en milisegundos
const FALLBACK_RATE = 20 // Fallback: 20 pesos por dólar
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'

/**
 * Hook para obtener el tipo de cambio USD a MXN en tiempo real
 * Usa una API gratuita con cache de 1 hora
 * Fallback a 20 pesos si falla la API
 */
export function useUSDtoMXN(): UseUSDtoMXNReturn {
  const [usdToMxn, setUsdToMxn] = useState<number>(FALLBACK_RATE)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        // 1. Verificar si hay cache válido en localStorage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(CACHE_KEY)
          if (cached) {
            const data: ExchangeRateData = JSON.parse(cached)
            const now = Date.now()

            // Si el cache tiene menos de 1 hora, usarlo
            if (now - data.timestamp < CACHE_DURATION) {
              setUsdToMxn(data.rate)
              setLastUpdate(new Date(data.timestamp))
              setIsLoading(false)
              return
            }
          }
        }

        // 2. Hacer fetch a la API si no hay cache o está vencido
        setIsLoading(true)
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        const mxnRate = data.rates?.MXN

        if (!mxnRate || typeof mxnRate !== 'number') {
          throw new Error('Invalid MXN rate in API response')
        }

        // 3. Validar que el rate es razonable (entre 15 y 25 pesos por dólar)
        if (mxnRate < 15 || mxnRate > 25) {
          console.warn(`Exchange rate seems unusual: ${mxnRate}. Using fallback.`)
          throw new Error('Unusual exchange rate')
        }

        // 4. Guardar en cache
        const cacheData: ExchangeRateData = {
          rate: mxnRate,
          timestamp: Date.now(),
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        }

        // 5. Actualizar estado
        setUsdToMxn(mxnRate)
        setLastUpdate(new Date())
        setError(null)

      } catch (err: any) {
        console.error('Error fetching USD to MXN rate:', err)
        setError(err.message || 'Failed to fetch exchange rate')

        // Usar fallback
        setUsdToMxn(FALLBACK_RATE)
        setLastUpdate(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRate()
  }, [])

  return {
    usdToMxn,
    isLoading,
    error,
    lastUpdate,
  }
}
