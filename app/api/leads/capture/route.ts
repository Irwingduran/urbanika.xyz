import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  // Rate limiting agresivo para prevenir spam
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'

  if (!checkRateLimit(`lead-capture:${ip}`, 3, 300000)) { // 3 requests por 5 minutos
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

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

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead guardado exitosamente',
    })
  } catch (error) {
    // Log solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === "development") { console.error('Error capturando lead:', error) }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
