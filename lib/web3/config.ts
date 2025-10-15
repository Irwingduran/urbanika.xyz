import { http, createConfig, fallback, createStorage } from 'wagmi'
import { scrollSepolia, scroll } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

/**
 * Configuración de Wagmi para Urbanika - Production Ready
 *
 * Chains configuradas:
 * - Scroll Sepolia (testnet)
 * - Scroll Mainnet
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
  chains: [scrollSepolia, scroll],
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
    // Scroll Sepolia con múltiples RPCs (fallback automático)
    [scrollSepolia.id]: fallback([
      http('https://sepolia-rpc.scroll.io'),
      http('https://scroll-sepolia.blockpi.network/v1/rpc/public'),
      http('https://scroll-testnet-public.unifra.io'),
    ]),
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

// Chain actual (según environment)
export const defaultChain = process.env.NODE_ENV === 'production'
  ? scroll
  : scrollSepolia

// Contract addresses por chain
export const CONTRACT_ADDRESSES = {
  [scrollSepolia.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA || '0x591D218a9Ac4843FB6f571273166B5d5df99E6c0',
  [scroll.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '',
} as const

// Helper para obtener contract address de la chain actual
export function getContractAddress(chainId: number): string {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] || ''
}
