import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * API para listar y administrar leads
 *
 * GET /api/leads/list?status=PENDING&limit=50
 * Lista todos los leads con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir filtros
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Obtener leads
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        investmentAmount: true,
        paymentMethod: true,
        cryptocurrency: true,
        status: true,
        nftMinted: true,
        tokenId: true,
        emailSent: true,
        emailSentAt: true,
        lastEmailType: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Obtener count total
    const totalCount = await prisma.lead.count({ where })

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + leads.length < totalCount,
      },
    })
  } catch (error) {
    console.error('❌ Error listando leads:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/leads/list
 * Actualizar el estado de un lead
 */
export async function PATCH(request: NextRequest) {
  try {
    const { leadId, updates } = await request.json()

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId es requerido' },
        { status: 400 }
      )
    }

    // Actualizar lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updates,
    })

    console.log(`✅ Lead ${leadId} actualizado:`, updates)

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    })
  } catch (error) {
    console.error('❌ Error actualizando lead:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
