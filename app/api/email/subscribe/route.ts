/**
 * API Route: Email subscription
 *
 * POST /api/email/subscribe
 *
 * Body:
 * - email: string
 * - name?: string
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validación
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // TODO: Integrar con tu servicio de email marketing
    // (Mailchimp, SendGrid, etc.)

    // Por ahora, solo registramos y retornamos éxito
    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
    })
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") { console.error('❌ Error in email subscription:', error) }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
