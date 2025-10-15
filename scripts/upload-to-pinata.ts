/**
 * Script para subir imágenes y metadata de NFTs a Pinata (IPFS)
 *
 * Uso:
 * 1. Configurar PINATA_JWT en .env
 * 2. Colocar imagen en public/nft-image.png
 * 3. Ejecutar: npx tsx scripts/upload-to-pinata.ts
 */

import { PinataSDK } from 'pinata'
import * as fs from 'fs'
import * as path from 'path'
import { generateNFTMetadata } from '../lib/ipfs/metadata'
import type { InvestmentTier } from '../lib/web3/abi'

// Configuración
const PINATA_JWT = process.env.PINATA_JWT
const IMAGE_PATH = path.join(process.cwd(), 'public/nft-image.png')

if (!PINATA_JWT) {
  console.error('❌ Error: PINATA_JWT no está configurado en .env')
  console.log('\n📋 Para obtener tu JWT:')
  console.log('1. Ve a https://app.pinata.cloud/')
  console.log('2. Crea una cuenta gratuita')
  console.log('3. Ve a API Keys > New Key')
  console.log('4. Copia el JWT y agrégalo a tu .env como PINATA_JWT=tu_jwt_aqui\n')
  process.exit(1)
}

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
})

/**
 * Sube la imagen del NFT a IPFS
 */
async function uploadImage(): Promise<string> {
  console.log('📤 Subiendo imagen a IPFS...')

  try {
    if (!fs.existsSync(IMAGE_PATH)) {
      throw new Error(`Imagen no encontrada en: ${IMAGE_PATH}`)
    }

    const file = fs.readFileSync(IMAGE_PATH)
    const blob = new Blob([file], { type: 'image/png' })

    const result = await pinata.upload.file(blob as File)

    console.log(`✅ Imagen subida exitosamente`)
    console.log(`   CID: ${result.cid}`)
    console.log(`   URL: https://gateway.pinata.cloud/ipfs/${result.cid}`)

    return result.cid
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error)
    throw error
  }
}

/**
 * Sube metadata JSON a IPFS
 */
async function uploadMetadata(imageCID: string, tokenId: number = 1): Promise<string> {
  console.log(`\n📤 Subiendo metadata para token #${tokenId}...`)

  try {
    // Generar metadata de ejemplo
    const metadata = generateNFTMetadata({
      tokenId,
      investmentAmount: '500',
      expectedReturn: '750',
      tier: 'Bronze' as InvestmentTier,
      mintDate: new Date(),
    })

    // Reemplazar placeholder con CID real
    metadata.image = `ipfs://${imageCID}`

    // Subir a Pinata
    const result = await pinata.upload.json(metadata)

    console.log(`✅ Metadata subida exitosamente`)
    console.log(`   CID: ${result.cid}`)
    console.log(`   URL: https://gateway.pinata.cloud/ipfs/${result.cid}`)
    console.log(`   Token URI para el contrato: ipfs://${result.cid}`)

    return result.cid
  } catch (error) {
    console.error('❌ Error subiendo metadata:', error)
    throw error
  }
}

/**
 * Genera metadata para múltiples tokens
 */
async function uploadBatchMetadata(
  imageCID: string,
  count: number = 5
): Promise<{ tokenId: number; metadataCID: string }[]> {
  console.log(`\n📤 Subiendo ${count} metadatas...`)

  const results: { tokenId: number; metadataCID: string }[] = []

  const tiers: InvestmentTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum']
  const amounts = [250, 500, 1000, 5000, 10000]

  for (let i = 0; i < count; i++) {
    const tokenId = i + 1
    const tier = tiers[i % tiers.length]
    const amount = amounts[i % amounts.length].toString()

    const metadata = generateNFTMetadata({
      tokenId,
      investmentAmount: amount,
      expectedReturn: (parseFloat(amount) * 1.5).toString(),
      tier,
      mintDate: new Date(),
    })

    metadata.image = `ipfs://${imageCID}`

    const result = await pinata.upload.json(metadata)

    results.push({
      tokenId,
      metadataCID: result.cid,
    })

    console.log(`   Token #${tokenId}: ipfs://${result.cid}`)
  }

  return results
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Urbánika NFT - Subida a IPFS\n')

  try {
    // 1. Subir imagen
    const imageCID = await uploadImage()

    // 2. Subir un metadata de ejemplo
    const metadataCID = await uploadMetadata(imageCID, 1)

    // 3. Opcional: Subir batch de metadatas
    // const batchResults = await uploadBatchMetadata(imageCID, 5)

    console.log('\n✨ ¡Proceso completado exitosamente!\n')
    console.log('📝 Próximos pasos:')
    console.log('1. Usa el Token URI cuando hagas mint de NFTs desde el contrato')
    console.log(`   Token URI: ipfs://${metadataCID}`)
    console.log('2. Los NFTs serán visibles en OpenSea y otros marketplaces')
    console.log('3. Puedes ver la metadata en:')
    console.log(`   https://gateway.pinata.cloud/ipfs/${metadataCID}\n`)
  } catch (error) {
    console.error('\n❌ Error en el proceso:', error)
    process.exit(1)
  }
}

// Ejecutar
main()
