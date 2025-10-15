import type { InvestmentTier } from '@/lib/web3/abi'

/**
 * Estructura de metadata para NFTs según el estándar ERC-721
 * Compatible con OpenSea y otros marketplaces
 */

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: NFTAttribute[]
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date'
}

/**
 * Genera metadata JSON para un NFT de inversión Urbanika
 */
export function generateNFTMetadata(params: {
  tokenId: number
  investmentAmount: string // en MXN
  expectedReturn: string // en MXN
  tier: InvestmentTier
  mintDate: Date
  investorEmail?: string
}): NFTMetadata {
  const { tokenId, investmentAmount, expectedReturn, tier, mintDate } = params

  // Colores según tier
  const tierColors = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Platinum: '#E5E4E2',
  }

  return {
    name: `Urbánika Investment #${tokenId}`,
    description: `NFT de inversión en Urbánika - Hogares regenerativos inteligentes y descentralizados. Este NFT representa una inversión de ${investmentAmount} MXN con un retorno esperado de ${expectedReturn} MXN (1.5x) a través de revenue-based financing.`,
    image: 'ipfs://PLACEHOLDER_IMAGE_CID', // Se reemplazará con el CID real
    external_url: 'https://urbanika.xyz/nft',
    attributes: [
      {
        trait_type: 'Tier',
        value: tier,
      },
      {
        trait_type: 'Investment Amount',
        value: investmentAmount,
      },
      {
        trait_type: 'Expected Return',
        value: expectedReturn,
      },
      {
        trait_type: 'ROI Multiplier',
        value: '1.5x',
      },
      {
        trait_type: 'Mint Date',
        value: Math.floor(mintDate.getTime() / 1000),
        display_type: 'date',
      },
      {
        trait_type: 'Tier Color',
        value: tierColors[tier],
      },
      {
        trait_type: 'Category',
        value: 'Regenerative Housing',
      },
      {
        trait_type: 'Network',
        value: 'Scroll',
      },
    ],
  }
}

/**
 * Genera metadata para múltiples NFTs
 */
export function generateBatchMetadata(investments: Array<{
  tokenId: number
  investmentAmount: string
  expectedReturn: string
  tier: InvestmentTier
  mintDate: Date
}>): NFTMetadata[] {
  return investments.map((investment) => generateNFTMetadata(investment))
}

/**
 * Valida que la metadata cumpla con el estándar ERC-721
 */
export function validateMetadata(metadata: NFTMetadata): boolean {
  if (!metadata.name || typeof metadata.name !== 'string') return false
  if (!metadata.description || typeof metadata.description !== 'string') return false
  if (!metadata.image || typeof metadata.image !== 'string') return false
  if (!Array.isArray(metadata.attributes)) return false

  return true
}
