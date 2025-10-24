import { http, createConfig, fallback, createStorage } from 'wagmi'
import { scroll } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import '@/lib/web3/metamask-fix' // Fix para errores de MetaMask

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

// Contract address en Scroll Mainnet (v2.0.2 with Chainlink Oracle)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '0xB7DECf6d81EBE13F9b2B485a88a3aaeA40A7Afc0'

// Helper para obtener contract address (siempre retorna mainnet)
export function getContractAddress(chainId?: number): string {
  return CONTRACT_ADDRESS
}
