/**
 * API Route: Upload NFT to IPFS
 *
 * POST /api/ipfs/upload
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
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
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

    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured. Please add PINATA_JWT to your .env file.' },
        { status: 500 }
      )
    }

    // Crear NFT en IPFS usando la imagen pre-subida
    console.log(`🚀 Creating NFT #${tokenId} on IPFS for ${investor}`)

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

    console.log(`✅ NFT #${tokenId} created successfully on IPFS`)

    return NextResponse.json({
      success: true,
      tokenURI: result.tokenURI,
      imageIpfsUrl: result.imageIpfsUrl,
      metadataIpfsUrl: result.metadataIpfsUrl,
      gatewayUrl: result.gatewayUrl,
    })
  } catch (error: any) {
    console.error('❌ Error in IPFS upload API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Endpoint para pre-subir la imagen base (útil para testing)
export async function GET(request: NextRequest) {
  try {
    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured' },
        { status: 500 }
      )
    }

    // Subir solo la imagen base
    const imagePath = path.join(process.cwd(), 'public', 'nft-image.png')
    const imageBuffer = await fs.readFile(imagePath)
    const blob = new Blob([imageBuffer], { type: 'image/png' })
    const imageFile = new File([blob], 'urbanika-nft.png', { type: 'image/png' })

    const { uploadFileToIPFS } = await import('@/lib/ipfs/pinata')
    const result = await uploadFileToIPFS(imageFile)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to upload image' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Base image uploaded successfully',
      ipfsUrl: result.ipfsUrl,
      ipfsHash: result.ipfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`,
    })
  } catch (error: any) {
    console.error('❌ Error uploading base image:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
