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
const FETCH_TIMEOUT = 10000 // 10 segundos timeout

// APIs alternativas (intentar en orden)
const API_URLS = [
  'https://api.exchangerate-api.com/v4/latest/USD',
  'https://open.er-api.com/v6/latest/USD',
  'https://api.exchangerate.host/latest?base=USD&symbols=MXN',
]

/**
 * Helper: Fetch con timeout
 */
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * Helper: Intentar obtener rate de una respuesta de API
 */
function extractMXNRate(data: any, apiUrl: string): number | null {
  console.log('[useUSDtoMXN] API Response:', apiUrl, data)

  // Diferentes formatos según la API
  if (data.rates?.MXN) {
    return data.rates.MXN
  }
  if (data.conversion_rates?.MXN) {
    return data.conversion_rates.MXN
  }
  return null
}

/**
 * Hook para obtener el tipo de cambio USD a MXN en tiempo real
 * Usa APIs gratuitas con cache de 1 hora y fallback a 20 pesos
 */
export function useUSDtoMXN(): UseUSDtoMXNReturn {
  const [usdToMxn, setUsdToMxn] = useState<number>(FALLBACK_RATE)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    async function fetchExchangeRate() {
      console.log('[useUSDtoMXN] Starting fetch...')

      try {
        // 1. Verificar si hay cache válido en localStorage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(CACHE_KEY)
          if (cached) {
            try {
              const data: ExchangeRateData = JSON.parse(cached)
              const now = Date.now()

              // Si el cache tiene menos de 1 hora, usarlo
              if (now - data.timestamp < CACHE_DURATION) {
                console.log('[useUSDtoMXN] Using cached rate:', data.rate)
                setUsdToMxn(data.rate)
                setLastUpdate(new Date(data.timestamp))
                setIsLoading(false)
                return
              }
            } catch (e) {
              console.warn('[useUSDtoMXN] Invalid cache, clearing:', e)
              localStorage.removeItem(CACHE_KEY)
            }
          }
        }

        // 2. Intentar con cada API hasta que una funcione
        setIsLoading(true)
        let mxnRate: number | null = null
        let successfulApi = ''

        for (const apiUrl of API_URLS) {
          try {
            console.log('[useUSDtoMXN] Trying API:', apiUrl)
            const response = await fetchWithTimeout(apiUrl, FETCH_TIMEOUT)

            if (!response.ok) {
              console.warn(`[useUSDtoMXN] API ${apiUrl} returned ${response.status}`)
              continue
            }

            const data = await response.json()
            mxnRate = extractMXNRate(data, apiUrl)

            if (mxnRate) {
              successfulApi = apiUrl
              console.log('[useUSDtoMXN] Got rate from API:', apiUrl, mxnRate)
              break
            }
          } catch (err: any) {
            console.warn(`[useUSDtoMXN] API ${apiUrl} failed:`, err.message)
            continue
          }
        }

        // Si ninguna API funcionó, usar fallback
        if (!mxnRate) {
          throw new Error('All APIs failed')
        }

        // 3. Validar que el rate es razonable (entre 15 y 25 pesos por dólar)
        if (mxnRate < 15 || mxnRate > 25) {
          console.warn(`[useUSDtoMXN] Unusual rate: ${mxnRate}. Using fallback.`)
          throw new Error('Unusual exchange rate')
        }

        // 4. Guardar en cache
        const cacheData: ExchangeRateData = {
          rate: mxnRate,
          timestamp: Date.now(),
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
          console.log('[useUSDtoMXN] Cached rate:', mxnRate)
        }

        // 5. Actualizar estado
        setUsdToMxn(mxnRate)
        setLastUpdate(new Date())
        setError(null)
        console.log('[useUSDtoMXN] Success! Rate:', mxnRate, 'from', successfulApi)

      } catch (err: any) {
        console.error('[useUSDtoMXN] All methods failed, using fallback:', err)
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
