/**
 * Script: Upload Base NFT Image to IPFS
 *
 * Este script sube la imagen base del bus Urbánika a IPFS usando Pinata.
 * Una vez subida, guarda la URL de IPFS para usarla en todos los NFTs.
 *
 * Uso:
 * npx tsx scripts/upload-nft-image.ts
 */

import fs from 'fs/promises'
import path from 'path'
import { PinataSDK } from 'pinata'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function main() {
  try {
    console.log('🚀 Iniciando subida de imagen base a IPFS...\n')

    // Verificar Pinata JWT
    if (!process.env.PINATA_JWT) {
      throw new Error(
        '❌ PINATA_JWT no está configurado.\n' +
        'Por favor:\n' +
        '1. Crea una cuenta en https://pinata.cloud\n' +
        '2. Genera un JWT en API Keys\n' +
        '3. Agrega PINATA_JWT=tu_jwt a tu archivo .env'
      )
    }

    // Inicializar Pinata
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
    })

    // Leer imagen
    const imagePath = path.join(process.cwd(), 'public', 'nft-image.png')
    console.log(`📖 Leyendo imagen desde: ${imagePath}`)

    const imageBuffer = await fs.readFile(imagePath)
    const imageSize = (imageBuffer.length / 1024).toFixed(2)
    console.log(`✅ Imagen cargada (${imageSize} KB)\n`)

    // Crear File
    const blob = new Blob([imageBuffer], { type: 'image/png' })
    const file = new File([blob], 'urbanika-nft-base.png', { type: 'image/png' })

    // Subir a IPFS
    console.log('📤 Subiendo a IPFS via Pinata...')
    const upload = await pinata.upload.file(file)

    const ipfsHash = upload.IpfsHash
    const ipfsUrl = `ipfs://${ipfsHash}`
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

    console.log('\n✅ ¡Imagen subida exitosamente a IPFS!')
    console.log('==========================================')
    console.log('IPFS URL:', ipfsUrl)
    console.log('IPFS Hash:', ipfsHash)
    console.log('Gateway URL:', gatewayUrl)
    console.log('==========================================\n')

    console.log('💡 Guarda estas URLs para usar en producción:')
    console.log(`NEXT_PUBLIC_NFT_BASE_IMAGE_IPFS=${ipfsUrl}`)
    console.log(`NEXT_PUBLIC_NFT_BASE_IMAGE_GATEWAY=${gatewayUrl}\n`)

    // Opcionalmente, guardar en un archivo
    const outputPath = path.join(process.cwd(), 'ipfs-image-urls.json')
    await fs.writeFile(
      outputPath,
      JSON.stringify(
        {
          ipfsUrl,
          ipfsHash,
          gatewayUrl,
          uploadedAt: new Date().toISOString(),
        },
        null,
        2
      )
    )

    console.log(`📝 URLs guardadas en: ${outputPath}`)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

main()
