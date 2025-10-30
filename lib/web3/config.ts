import { http, createConfig, fallback, createStorage } from 'wagmi'
import { scroll, scrollSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import '@/lib/web3/metamask-fix' // Fix para errores de MetaMask

/**
 * Configuración de Wagmi para Urbanika
 *
 * Chains configuradas:
 * - Scroll Mainnet (Chain ID: 534352)
 * - Scroll Sepolia (Chain ID: 534351) - Testnet
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
  chains: [scroll, scrollSepolia],
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
    // Scroll Sepolia Testnet
    [scrollSepolia.id]: fallback([
      http('https://sepolia-rpc.scroll.io/'),
      http('https://scroll-sepolia.blockpi.network/v1/rpc/public'),
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

// Contract addresses
const CONTRACT_ADDRESS_MAINNET = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '0x1F3B7B68627f8B9BFe3db1F4a419ee20226b4a1d'
const CONTRACT_ADDRESS_SEPOLIA = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA || '0x591D218a9Ac4843FB6f571273166B5d5df99E6c0'

// Contract address por defecto (mainnet)
export const CONTRACT_ADDRESS = CONTRACT_ADDRESS_MAINNET

// Helper para obtener contract address según chainId
export function getContractAddress(chainId?: number): string {
  if (chainId === scrollSepolia.id) {
    return CONTRACT_ADDRESS_SEPOLIA
  }
  return CONTRACT_ADDRESS_MAINNET
}
