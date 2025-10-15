import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.email || !data.status) {
      return NextResponse.json(
        { error: 'Email y status son requeridos' },
        { status: 400 }
      )
    }

    // Generar un ID único para el lead
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // TODO: Aquí guardarías en tu base de datos
    // Por ahora solo validamos y retornamos el leadId
    // Ejemplos de integraciones:
    // - MongoDB: await db.collection('leads').insertOne({ ...data, leadId })
    // - PostgreSQL: await prisma.lead.create({ data: { ...data, leadId } })
    // - Supabase: await supabase.from('leads').insert({ ...data, leadId })

    console.log('Lead captured:', {
      leadId,
      email: data.email,
      name: data.name,
      investmentAmount: data.investmentAmount,
      status: data.status,
      timestamp: data.timestamp,
    })

    // Retornar éxito con el leadId
    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead capturado exitosamente',
    })
  } catch (error) {
    console.error('Error capturando lead:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
