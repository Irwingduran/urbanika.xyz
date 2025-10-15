/**
 * Pinata IPFS Utility para Urbanika
 *
 * Maneja la subida de imágenes y metadata a IPFS usando Pinata.
 *
 * Setup:
 * 1. Crea cuenta en https://pinata.cloud
 * 2. Genera un JWT en API Keys
 * 3. Agrega PINATA_JWT a tu .env
 */

import { PinataSDK } from 'pinata'

// Inicializar Pinata
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
})

/**
 * NFT Metadata según estándar ERC721
 */
export interface NFTMetadata {
  name: string
  description: string
  image: string // IPFS URL de la imagen
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  // Metadata adicional de Urbanika
  external_url?: string
  background_color?: string
}

/**
 * Sube un archivo a IPFS vía Pinata
 */
export async function uploadFileToIPFS(file: File): Promise<{
  success: boolean
  ipfsUrl?: string
  ipfsHash?: string
  error?: string
}> {
  try {
    if (!process.env.PINATA_JWT) {
      throw new Error('PINATA_JWT no está configurado en .env')
    }

    // Subir archivo a Pinata
    const upload = await pinata.upload.file(file)

    const ipfsHash = upload.IpfsHash
    const ipfsUrl = `ipfs://${ipfsHash}`
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

    console.log('✅ Archivo subido a IPFS:', {
      ipfsUrl,
      gatewayUrl,
      hash: ipfsHash,
    })

    return {
      success: true,
      ipfsUrl,
      ipfsHash,
    }
  } catch (error: any) {
    console.error('❌ Error subiendo archivo a IPFS:', error)
    return {
      success: false,
      error: error.message || 'Error desconocido',
    }
  }
}

/**
 * Sube metadata JSON a IPFS
 */
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<{
  success: boolean
  ipfsUrl?: string
  ipfsHash?: string
  gatewayUrl?: string
  error?: string
}> {
  try {
    if (!process.env.PINATA_JWT) {
      throw new Error('PINATA_JWT no está configurado en .env')
    }

    // Convertir metadata a JSON
    const blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json',
    })

    // Crear File desde Blob
    const file = new File([blob], 'metadata.json', {
      type: 'application/json',
    })

    // Subir a Pinata
    const upload = await pinata.upload.file(file)

    const ipfsHash = upload.IpfsHash
    const ipfsUrl = `ipfs://${ipfsHash}`
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

    console.log('✅ Metadata subida a IPFS:', {
      ipfsUrl,
      gatewayUrl,
      hash: ipfsHash,
    })

    return {
      success: true,
      ipfsUrl,
      ipfsHash,
      gatewayUrl,
    }
  } catch (error: any) {
    console.error('❌ Error subiendo metadata a IPFS:', error)
    return {
      success: false,
      error: error.message || 'Error desconocido',
    }
  }
}

/**
 * Helper: Convierte URL de imagen local a File
 */
export async function urlToFile(
  url: string,
  filename: string
): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

/**
 * Genera metadata completa para un NFT de inversión de Urbanika
 */
export function generateUrbanikaNFTMetadata(params: {
  tokenId: number
  investmentAmount: number
  expectedReturn: number
  investor: string
  imageIpfsUrl: string
}): NFTMetadata {
  const { tokenId, investmentAmount, expectedReturn, investor, imageIpfsUrl } = params

  return {
    name: `Urbanika Investment NFT #${tokenId}`,
    description: `Investment certificate for ${investmentAmount} MXN in Urbanika regenerative housing project. Expected return: ${expectedReturn} MXN (1.5x).`,
    image: imageIpfsUrl,
    external_url: 'https://urbanika.xyz',
    background_color: '00BFA6', // Brand aqua
    attributes: [
      {
        trait_type: 'Investment Amount (MXN)',
        value: investmentAmount,
      },
      {
        trait_type: 'Expected Return (MXN)',
        value: expectedReturn,
      },
      {
        trait_type: 'Return Multiplier',
        value: '1.5x',
      },
      {
        trait_type: 'Investment Tier',
        value: getInvestmentTier(investmentAmount),
      },
      {
        trait_type: 'Investor Address',
        value: `${investor.slice(0, 6)}...${investor.slice(-4)}`,
      },
      {
        trait_type: 'Project',
        value: 'Urbanika Regenerative Housing',
      },
      {
        trait_type: 'Blockchain',
        value: 'Scroll',
      },
      {
        trait_type: 'Mint Date',
        value: new Date().toISOString().split('T')[0],
      },
    ],
  }
}

/**
 * Determina el tier de inversión según el monto
 */
function getInvestmentTier(amount: number): string {
  if (amount >= 10000) return 'Diamond'
  if (amount >= 5000) return 'Platinum'
  if (amount >= 2500) return 'Gold'
  if (amount >= 1000) return 'Silver'
  if (amount >= 500) return 'Bronze'
  return 'Starter'
}

/**
 * Workflow completo: Sube imagen + metadata a IPFS
 * Retorna el tokenURI listo para usar en el smart contract
 */
export async function createNFTOnIPFS(params: {
  imageFile?: File
  tokenId: number
  investmentAmount: number
  expectedReturn: number
  investor: string
  usePreUploadedImage?: boolean
}): Promise<{
  success: boolean
  tokenURI?: string
  imageIpfsUrl?: string
  metadataIpfsUrl?: string
  gatewayUrl?: string
  error?: string
}> {
  try {
    let imageIpfsUrl: string

    // Si hay una imagen pre-subida en .env, usarla
    if (params.usePreUploadedImage && process.env.NEXT_PUBLIC_NFT_BASE_IMAGE_IPFS) {
      console.log('✅ Usando imagen pre-subida desde .env')
      imageIpfsUrl = process.env.NEXT_PUBLIC_NFT_BASE_IMAGE_IPFS
    } else if (params.imageFile) {
      // 1. Subir imagen a IPFS
      console.log('📤 Subiendo imagen a IPFS...')
      const imageUpload = await uploadFileToIPFS(params.imageFile)
      if (!imageUpload.success || !imageUpload.ipfsUrl) {
        return {
          success: false,
          error: imageUpload.error || 'Error subiendo imagen',
        }
      }
      imageIpfsUrl = imageUpload.ipfsUrl
    } else {
      return {
        success: false,
        error: 'No se proporcionó imagen ni hay imagen pre-subida',
      }
    }

    // 2. Generar metadata con la URL de la imagen
    console.log('📝 Generando metadata...')
    const metadata = generateUrbanikaNFTMetadata({
      ...params,
      imageIpfsUrl,
    })

    // 3. Subir metadata a IPFS
    console.log('📤 Subiendo metadata a IPFS...')
    const metadataUpload = await uploadMetadataToIPFS(metadata)
    if (!metadataUpload.success || !metadataUpload.ipfsUrl) {
      return {
        success: false,
        error: metadataUpload.error || 'Error subiendo metadata',
      }
    }

    console.log('✅ NFT creado exitosamente en IPFS')

    return {
      success: true,
      tokenURI: metadataUpload.ipfsUrl, // Este es el que se pasa al smart contract
      imageIpfsUrl: imageUpload.ipfsUrl,
      metadataIpfsUrl: metadataUpload.ipfsUrl,
      gatewayUrl: metadataUpload.gatewayUrl,
    }
  } catch (error: any) {
    console.error('❌ Error en workflow de IPFS:', error)
    return {
      success: false,
      error: error.message || 'Error desconocido',
    }
  }
}
