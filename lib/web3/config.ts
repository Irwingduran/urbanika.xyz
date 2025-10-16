import { http, createConfig, fallback, createStorage } from 'wagmi'
import { scroll } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

/**
 * Configuración de Wagmi para Urbanika - Production
 *
 * Chain configurada:
 * - Scroll Mainnet (Chain ID: 534352)
 *
 * Features:
 * - Multiple RPC endpoints con fallback automático
 * - WalletConnect para soporte de 300+ wallets
 * - Persistencia de sesión con localStorage
 * - Auto-reconnect al recargar página
 */

// WalletConnect Project ID (RECOMENDADO para producción)
// Obtén uno gratis en: https://cloud.walletconnect.com/
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Metadata para WalletConnect
const metadata = {
  name: 'Urbanika',
  description: 'Invierte en casas regenerativas con NFTs',
  url: 'https://urbanika.xyz',
  icons: ['https://urbanika.xyz/icon.png'],
}

export const config = createConfig({
  chains: [scroll],
  connectors: [
    injected(), // MetaMask, Coinbase Wallet, etc.
    ...(projectId
      ? [
          walletConnect({
            projectId,
            metadata,
            showQrModal: true,
          }),
        ]
      : []),
  ],
  transports: {
    // Scroll Mainnet con múltiples RPCs (fallback automático)
    [scroll.id]: fallback([
      http('https://rpc.scroll.io'),
      http('https://scroll.blockpi.network/v1/rpc/public'),
      http('https://scroll-mainnet.public.blastapi.io'),
    ]),
  },
  // Habilitar SSR para Next.js
  ssr: true,
  // Persistir sesión en localStorage
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }),
})

// Chain por defecto: Scroll Mainnet
export const defaultChain = scroll

// Contract address en Scroll Mainnet
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '0x263E2E6C8d7a338deBac013143916d9709C18441'

// Helper para obtener contract address (siempre retorna mainnet)
export function getContractAddress(chainId?: number): string {
  return CONTRACT_ADDRESS
}
