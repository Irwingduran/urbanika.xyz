import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protectedApiRoute } from '@/lib/auth/middleware'
// DESACTIVADO: Email functionality temporalmente deshabilitado
// import { sendWelcomeEmail, sendNFTReadyEmail, sendPaymentReminderEmail } from '@/lib/email'

/**
 * API para enviar notificaciones por email a leads (Protected)
 * TEMPORALMENTE DESACTIVADO - Email functionality será implementado en el futuro
 *
 * POST /api/leads/notify
 * Headers: x-api-key (required)
 * Body: { leadId: string, type: 'welcome' | 'nft_ready' | 'reminder', data?: any }
 */
export async function POST(request: NextRequest) {
  // Verificar autenticación - este endpoint modifica datos, debe estar protegido
  const { authorized, response } = await protectedApiRoute(request, {
    requireApiKey: true // Siempre requerir API key
  })

  if (!authorized) {
    return response!
  }

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

    // DESACTIVADO: Email sending temporalmente deshabilitado
    // Mock success response
    const result: { success: boolean; error?: string } = { success: true }

    /* DESACTIVADO TEMPORALMENTE
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
    */

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

      return NextResponse.json({
        success: true,
        message: 'Email enviado exitosamente (modo testing)',
        leadId,
        type,
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Error enviando email' },
        { status: 500 }
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === "development") { console.error('Error en /api/leads/notify:', error) }
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/leads/notify?leadId=xxx
 * Obtener información del lead y emails enviados (Protected)
 * Headers: x-api-key (required)
 */
export async function GET(request: NextRequest) {
  // Verificar autenticación
  const { authorized, response } = await protectedApiRoute(request, {
    requireApiKey: true
  })

  if (!authorized) {
    return response!
  }

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
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === "development") { console.error('Error obteniendo lead:', error) }
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
