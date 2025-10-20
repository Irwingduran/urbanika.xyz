import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail, sendNFTReadyEmail, sendPaymentReminderEmail } from '@/lib/email'

/**
 * API para enviar notificaciones por email a leads
 *
 * POST /api/leads/notify
 * Body: { leadId: string, type: 'welcome' | 'nft_ready' | 'reminder', data?: any }
 */
export async function POST(request: NextRequest) {
  try {
    const { leadId, type, data } = await request.json()

    if (!leadId || !type) {
      return NextResponse.json(
        { error: 'leadId y type son requeridos' },
        { status: 400 }
      )
    }

    // Buscar el lead en la base de datos
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    let result: { success: boolean; error?: string } = { success: false }

    // Enviar el email según el tipo
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(lead.email, lead.name || undefined)
        break

      case 'nft_ready':
        if (!data?.tokenId || !data?.txHash) {
          return NextResponse.json(
            { error: 'Para tipo nft_ready se requiere tokenId y txHash en data' },
            { status: 400 }
          )
        }
        result = await sendNFTReadyEmail(lead.email, {
          name: lead.name || undefined,
          tokenId: data.tokenId,
          txHash: data.txHash,
          investmentAmount: lead.investmentAmount || 0,
        })
        break

      case 'reminder':
        result = await sendPaymentReminderEmail(lead.email, lead.name || undefined)
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de email no válido. Usa: welcome, nft_ready, o reminder' },
          { status: 400 }
        )
    }

    // Si el email se envió exitosamente, actualizar el lead
    if (result.success) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
          lastEmailType: type,
        },
      })

      console.log(`✅ Email enviado al lead ${leadId} (${type})`)

      return NextResponse.json({
        success: true,
        message: 'Email enviado exitosamente',
        leadId,
        type,
      })
    } else {
      console.error(`❌ Error enviando email al lead ${leadId}:`, result.error)

      return NextResponse.json(
        { error: result.error || 'Error enviando email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Error en /api/leads/notify:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/leads/notify?leadId=xxx
 * Obtener información del lead y emails enviados
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId es requerido' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        email: true,
        name: true,
        emailSent: true,
        emailSentAt: true,
        lastEmailType: true,
        status: true,
        createdAt: true,
      },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead,
    })
  } catch (error) {
    console.error('❌ Error obteniendo lead:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
