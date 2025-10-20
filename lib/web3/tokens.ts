/**
 * Tokens soportados en Scroll Mainnet para pagos
 */

export const SCROLL_CHAIN_ID = 534352

// Direcciones de tokens en Scroll Mainnet
export const TOKEN_ADDRESSES = {
  USDC: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
  USDT: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
} as const

export type SupportedToken = 'ETH' | 'USDC' | 'USDT'

// Metadata de los tokens
export const TOKENS: Record<SupportedToken, {
  symbol: string
  name: string
  address: string | null
  decimals: number
  logo: string
}> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: null, // Native token
    decimals: 18,
    logo: '⟠',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: TOKEN_ADDRESSES.USDC,
    decimals: 6,
    logo: '$',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: TOKEN_ADDRESSES.USDT,
    decimals: 6,
    logo: '₮',
  },
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
