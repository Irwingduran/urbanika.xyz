"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { useState, type ReactNode } from 'react'

/**
 * Provider de Web3 para Urbanika
 *
 * Envuelve la aplicación con WagmiProvider y QueryClientProvider
 *
 * Uso en app/layout.tsx:
 * <Web3Provider>
 *   {children}
 * </Web3Provider>
 */

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minuto
            refetchInterval: 1000 * 30, // 30 segundos
          },
        },
      })
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
