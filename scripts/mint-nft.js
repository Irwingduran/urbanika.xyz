/**
 * Script para mintear NFTs en el contrato UrbanikaNFT
 *
 * Uso:
 * node scripts/mint-nft.js <wallet_address> <amount_in_mxn> <token_uri> <email>
 *
 * Ejemplo:
 * node scripts/mint-nft.js 0x123... 500 ipfs://Qm... investor@example.com
 */

const { ethers } = require('hardhat')
require('dotenv').config()

const URBANIKA_NFT_ABI = [
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
]

async function main() {
  // Obtener argumentos
  const args = process.argv.slice(2)

  if (args.length < 4) {
    console.error('❌ Error: Faltan argumentos\n')
    console.log('Uso:')
    console.log('  node scripts/mint-nft.js <wallet_address> <amount> <token_uri> <email>\n')
    console.log('Ejemplo:')
    console.log('  node scripts/mint-nft.js 0x123... 500 ipfs://Qm... investor@example.com\n')
    process.exit(1)
  }

  const [toAddress, amount, tokenURI, email] = args

  // Validaciones
  if (!ethers.isAddress(toAddress)) {
    console.error('❌ Error: Dirección de wallet inválida')
    process.exit(1)
  }

  const investmentAmount = parseFloat(amount)
  if (isNaN(investmentAmount) || investmentAmount <= 0) {
    console.error('❌ Error: Monto de inversión inválido')
    process.exit(1)
  }

  if (!tokenURI.startsWith('ipfs://')) {
    console.error('⚠️  Advertencia: El token URI debería empezar con ipfs://')
  }

  console.log('🚀 Urbánika NFT - Mint\n')
  console.log('Parámetros:')
  console.log(`  Wallet: ${toAddress}`)
  console.log(`  Monto: ${amount} MXN`)
  console.log(`  Token URI: ${tokenURI}`)
  console.log(`  Email: ${email}\n`)

  // Conectar al contrato
  const contractAddress = process.env.URBANIKA_NFT_ADDRESS
  if (!contractAddress) {
    console.error('❌ Error: URBANIKA_NFT_ADDRESS no está configurado en .env')
    process.exit(1)
  }

  const [signer] = await ethers.getSigners()
  console.log(`📝 Usando wallet: ${signer.address}`)

  const contract = new ethers.Contract(contractAddress, URBANIKA_NFT_ABI, signer)

  // Convertir amount a wei (asumiendo 18 decimales)
  const amountInWei = ethers.parseEther(amount)

  console.log('\n⏳ Minteando NFT...')

  try {
    const tx = await contract.mint(toAddress, amountInWei, tokenURI, email)
    console.log(`📤 Transacción enviada: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(`✅ NFT minteado exitosamente en el bloque ${receipt.blockNumber}`)

    // Extraer tokenId del evento
    const mintEvent = receipt.logs.find((log) => {
      try {
        const parsed = contract.interface.parseLog(log)
        return parsed?.name === 'NFTMinted'
      } catch {
        return false
      }
    })

    if (mintEvent) {
      const parsed = contract.interface.parseLog(mintEvent)
      const tokenId = parsed.args.tokenId
      console.log(`🎉 Token ID: ${tokenId}`)
      console.log(`\n🔗 Ver en Scrollscan:`)
      console.log(`   https://sepolia.scrollscan.com/tx/${tx.hash}`)
      console.log(`\n🖼️  Ver NFT en OpenSea (puede tardar unos minutos):`)
      console.log(
        `   https://testnets.opensea.io/assets/scroll-sepolia/${contractAddress}/${tokenId}`
      )
    }
  } catch (error) {
    console.error('\n❌ Error minteando NFT:', error.message)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
