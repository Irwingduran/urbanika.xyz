/**
 * ABI del contrato UrbanikaNFT
 *
 * Este es un subset del ABI completo con solo las funciones que usaremos
 * en el frontend. El ABI completo está en: artifacts/contracts/UrbanikaNFT.sol/UrbanikaNFT.json
 */

export const URBANIKA_NFT_ABI = [
  // Read functions
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getInvestment',
    outputs: [
      {
        components: [
          { name: 'investmentAmount', type: 'uint256' },
          { name: 'expectedReturn', type: 'uint256' },
          { name: 'currentReturn', type: 'uint256' },
          { name: 'mintDate', type: 'uint256' },
          { name: 'tier', type: 'uint8' },
          { name: 'isActive', type: 'bool' },
          { name: 'investor', type: 'address' },
          { name: 'emailHash', type: 'bytes32' },
        ],
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getReturnProgress',
    outputs: [{ name: 'percentage', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'investor', type: 'address' }],
    name: 'getInvestorTokens',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveNFTCount',
    outputs: [{ name: 'count', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalInvestmentAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDistributed',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions (solo owner)
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'investmentAmount', type: 'uint256' },
      { name: 'tokenURI', type: 'string' },
      { name: 'investorEmail', type: 'string' },
    ],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Public mint con pago en ETH
  {
    inputs: [
      { name: '_tokenURI', type: 'string' },
    ],
    name: 'publicMintWithETH',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  // Public mint con pago en tokens ERC20
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: '_tokenURI', type: 'string' },
      { name: 'paymentTokenAddress', type: 'address' }
    ],
    name: 'publicMintWithToken',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Token acceptance management
  {
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'isAccepted', type: 'bool' }
    ],
    name: 'setTokenAcceptance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenAddress', type: 'address' }],
    name: 'acceptedTokens',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'newTreasury', type: 'address' }],
    name: 'proposeTreasuryChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'executeTreasuryChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cancelTreasuryChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingTreasury',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasuryChangeTimestamp',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TREASURY_TIMELOCK',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'activeNFTCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPaused',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'toggleMintPause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'email', type: 'string' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'verifyEmail',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'distributeReturn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'investor', type: 'address' },
      { indexed: false, name: 'investmentAmount', type: 'uint256' },
      { indexed: false, name: 'tier', type: 'uint8' },
      { indexed: false, name: 'expectedReturn', type: 'uint256' },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'totalReceived', type: 'uint256' },
    ],
    name: 'ReturnDistributed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'investor', type: 'address' },
      { indexed: false, name: 'totalReturn', type: 'uint256' },
    ],
    name: 'InvestmentCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'oldTreasury', type: 'address' },
      { indexed: true, name: 'newTreasury', type: 'address' },
      { indexed: false, name: 'unlockTime', type: 'uint256' },
    ],
    name: 'TreasuryChangeProposed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'oldTreasury', type: 'address' },
      { indexed: true, name: 'newTreasury', type: 'address' },
    ],
    name: 'TreasuryUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'oldPrice', type: 'uint256' },
      { indexed: false, name: 'newPrice', type: 'uint256' },
    ],
    name: 'PricePerUnitUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'isPaused', type: 'bool' },
    ],
    name: 'MintPauseToggled',
    type: 'event',
  },
  // Oracle de precios - funciones v2.0.2
  {
    inputs: [],
    name: 'getETHPriceUSD',
    outputs: [{ name: 'price', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ethPriceFeed',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manualETHPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_priceFeed', type: 'address' }],
    name: 'setPriceFeed',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'newPrice', type: 'uint256' }],
    name: 'setManualETHPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'uint8' }],
    name: 'getContractBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Types derivados del ABI (actualizado para v2.0)
export type Investment = {
  investmentAmount: bigint
  expectedReturn: bigint
  currentReturn: bigint
  mintDate: bigint
  tier: number
  isActive: boolean
  investor: string
  emailHash: string // Cambiado de email a emailHash
}

export type InvestmentTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export function getTierName(tier: number): InvestmentTier {
  const tiers: InvestmentTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum']
  return tiers[tier] || 'Bronze'
}
