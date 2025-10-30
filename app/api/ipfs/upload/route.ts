/**
 * API Route: Upload NFT to IPFS (Protected)
 *
 * POST /api/ipfs/upload
 *
 * Seguridad:
 * - Rate limiting: 10 requests por minuto por IP
 * - Same-origin only: Solo acepta peticiones del mismo dominio
 * - API key opcional: x-api-key header (para scripts externos)
 *
 * Body:
 * - tokenId: number
 * - investmentAmount: number
 * - expectedReturn: number
 * - investor: string (wallet address)
 * - useDefaultImage: boolean (optional, usa la imagen del bus por defecto)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createNFTOnIPFS, urlToFile } from '@/lib/ipfs/pinata'
import { protectedApiRoute } from '@/lib/auth/middleware'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  // Verificar autenticación y rate limiting
  const { authorized, response } = await protectedApiRoute(request, {
    rateLimit: { maxRequests: 10, windowMs: 60000 }, // 10 requests por minuto
    requireApiKey: process.env.NODE_ENV === 'production'
  })

  if (!authorized) {
    return response!
  }

  try {
    const body = await request.json()
    const { tokenId, investmentAmount, expectedReturn, investor, useDefaultImage = true } = body

    // Validaciones
    if (!tokenId || !investmentAmount || !expectedReturn || !investor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validar que investor es una dirección de wallet válida
    if (typeof investor !== 'string' || !investor.startsWith('0x') || investor.length !== 42) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    // Validar que los montos son números positivos
    if (investmentAmount <= 0 || expectedReturn <= 0) {
      return NextResponse.json(
        { error: 'Investment and return must be positive numbers' },
        { status: 400 }
      )
    }

    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured. Please add PINATA_JWT to your .env file.' },
        { status: 500 }
      )
    }

    // Crear NFT en IPFS usando la imagen pre-subida
    // Si hay imagen pre-subida en .env, usarla (más rápido y eficiente)
    const usePreUploaded = !!process.env.NEXT_PUBLIC_NFT_BASE_IMAGE_IPFS

    let imageFile: File | undefined

    if (!usePreUploaded && useDefaultImage) {
      // Fallback: subir imagen desde archivo local
      const imagePath = path.join(process.cwd(), 'public', 'nft-image.png')
      const imageBuffer = await fs.readFile(imagePath)
      const blob = new Blob([imageBuffer], { type: 'image/png' })
      imageFile = new File([blob], 'urbanika-nft.png', { type: 'image/png' })
    }

    const result = await createNFTOnIPFS({
      imageFile,
      tokenId,
      investmentAmount,
      expectedReturn,
      investor,
      usePreUploadedImage: usePreUploaded,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to upload to IPFS' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      tokenURI: result.tokenURI,
      imageIpfsUrl: result.imageIpfsUrl,
      metadataIpfsUrl: result.metadataIpfsUrl,
      gatewayUrl: result.gatewayUrl,
    })
  } catch (error: any) {
    // Log errors solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === "development") { console.error('Error in IPFS upload API:', error) }
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * NOTA DE SEGURIDAD:
 * El endpoint GET anterior fue removido porque permitía a cualquiera
 * subir archivos a Pinata sin autenticación, consumiendo la cuota.
 *
 * Para subir la imagen base, usar el script:
 * npm run upload-nft-image
 */
