import { prisma } from '../lib/prisma'

async function main() {
  console.log('📊 Consultando leads en la base de datos...\n')

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  if (leads.length === 0) {
    console.log('❌ No hay leads en la base de datos')
    return
  }

  console.log(`✅ Encontrados ${leads.length} leads:\n`)

  leads.forEach((lead, index) => {
    console.log(`Lead #${index + 1}:`)
    console.log(`  ID: ${lead.id}`)
    console.log(`  Email: ${lead.email}`)
    console.log(`  Nombre: ${lead.name || 'N/A'}`)
    console.log(`  Phone: ${lead.phone || 'N/A'}`)
    console.log(`  Investment: ${lead.investmentAmount || 'N/A'} MXN`)
    console.log(`  Status: ${lead.status}`)
    console.log(`  NFT Minted: ${lead.nftMinted}`)
    console.log(`  Metadata: ${JSON.stringify(lead.metadata, null, 2)}`)
    console.log(`  Created: ${lead.createdAt}`)
    console.log('---\n')
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
