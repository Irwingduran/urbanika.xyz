import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * API segura para actualizar un lead después de mintear NFT
 *
 * POST /api/leads/update-mint
 * Solo permite actualizar el estado de mint con un hash de transacción válido
 */
export async function POST(request: NextRequest) {
  try {
    const { leadId, mintTxHash, tokenId } = await request.json()

    // Validación estricta
    if (!leadId || typeof leadId !== 'string') {
      return NextResponse.json({ error: 'leadId inválido' }, { status: 400 })
    }

    if (!mintTxHash || typeof mintTxHash !== 'string' || !mintTxHash.startsWith('0x')) {
      return NextResponse.json({ error: 'mintTxHash inválido' }, { status: 400 })
    }

    // Verificar que el lead existe
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    }

    // Solo permitir actualizar si no ha sido minteado previamente
    // (prevenir modificaciones maliciosas)
    if (existingLead.nftMinted && existingLead.mintTxHash) {
      console.warn(`⚠️  Intento de actualizar lead ya minteado: ${leadId}`)
      return NextResponse.json(
        { error: 'Este lead ya tiene un NFT minteado' },
        { status: 400 }
      )
    }

    // Actualizar lead con información del mint
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'NFT_DELIVERED',
        nftMinted: true,
        mintTxHash,
        tokenId: tokenId || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        nftMinted: true,
        mintTxHash: true,
        tokenId: true,
      },
    })

    console.log(`✅ Lead ${leadId} actualizado con mint exitoso: ${mintTxHash}`)

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    })
  } catch (error) {
    console.error('❌ Error actualizando lead:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
