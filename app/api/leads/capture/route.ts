import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Extraer WhatsApp de metadata si existe
    const whatsapp = data.metadata?.whatsapp || data.phone || null

    // Guardar lead en la base de datos
    const lead = await prisma.lead.create({
      data: {
        email: data.email,
        name: data.name || null,
        phone: whatsapp,
        investmentAmount: data.investmentAmount ? parseInt(data.investmentAmount) : null,
        paymentMethod: data.paymentMethod || null,
        cryptocurrency: data.cryptocurrency || null,
        status: 'PENDING',
        source: data.source || 'nft_purchase_form',
        metadata: data.metadata || {},
      },
    })

    console.log('✅ Lead guardado en base de datos:', {
      id: lead.id,
      email: lead.email,
      name: lead.name,
      phone: lead.phone,
      investmentAmount: lead.investmentAmount,
      status: lead.status,
      createdAt: lead.createdAt,
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead guardado exitosamente',
    })
  } catch (error) {
    console.error('❌ Error capturando lead:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
