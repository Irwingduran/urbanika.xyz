/**
 * Tokens soportados para pagos en Scroll (Mainnet y Sepolia)
 */

export const SCROLL_CHAIN_ID = 534352
export const SCROLL_SEPOLIA_CHAIN_ID = 534351

// Direcciones de tokens en Scroll Mainnet
export const TOKEN_ADDRESSES_MAINNET = {
  USDC: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
  USDT: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
} as const

// Direcciones de tokens en Scroll Sepolia (Testnet)
// Nota: Estas son direcciones de tokens de testnet. Puedes obtener tokens de prueba en:
// - USDC Sepolia: https://faucet.circle.com/
// - USDT Sepolia: Puedes deployar tu propio mock o usar faucets
export const TOKEN_ADDRESSES_SEPOLIA = {
  USDC: '0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D', // Mock USDC en Scroll Sepolia
  USDT: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df', // Mock USDT en Scroll Sepolia
} as const

// Direcciones por defecto (Mainnet)
export const TOKEN_ADDRESSES = TOKEN_ADDRESSES_MAINNET

export type SupportedToken = 'ETH' | 'USDC' | 'USDT'

// Helper para obtener direcciones de tokens según chainId
export function getTokenAddresses(chainId?: number) {
  if (chainId === SCROLL_SEPOLIA_CHAIN_ID) {
    return TOKEN_ADDRESSES_SEPOLIA
  }
  return TOKEN_ADDRESSES_MAINNET
}

// Helper para obtener dirección de un token específico
export function getTokenAddress(token: 'USDC' | 'USDT', chainId?: number): string {
  const addresses = getTokenAddresses(chainId)
  return addresses[token]
}

// Metadata base de los tokens (sin address específica)
interface TokenMetadata {
  symbol: string
  name: string
  decimals: number
  logo: string
}

const TOKEN_METADATA: Record<SupportedToken, TokenMetadata> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '⟠',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '$',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: '₮',
  },
}

// Metadata de los tokens (por defecto usa Mainnet)
export const TOKENS: Record<SupportedToken, {
  symbol: string
  name: string
  address: string | null
  decimals: number
  logo: string
}> = {
  ETH: {
    ...TOKEN_METADATA.ETH,
    address: null, // Native token
  },
  USDC: {
    ...TOKEN_METADATA.USDC,
    address: TOKEN_ADDRESSES_MAINNET.USDC,
  },
  USDT: {
    ...TOKEN_METADATA.USDT,
    address: TOKEN_ADDRESSES_MAINNET.USDT,
  },
}

// Helper para obtener metadata de un token con la dirección correcta según chainId
export function getTokenMetadata(token: SupportedToken, chainId?: number) {
  const metadata = TOKEN_METADATA[token]
  if (token === 'ETH') {
    return { ...metadata, address: null }
  }
  const address = getTokenAddress(token as 'USDC' | 'USDT', chainId)
  return { ...metadata, address }
}

// ABI mínimo para interactuar con tokens ERC20
export const ERC20_ABI = [
  // Funciones de lectura
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  // Funciones de escritura
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  // Eventos
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const
