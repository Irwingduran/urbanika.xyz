import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.amount || !data.email) {
      return NextResponse.json(
        { error: 'Amount y email son requeridos' },
        { status: 400 }
      )
    }

    // TODO: Implementar integración real con Stripe
    // Por ahora retornamos un mock para que el flujo funcione

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

    if (!STRIPE_SECRET_KEY) {
      // Si no hay Stripe configurado, mostrar "próximamente"
      console.warn('⚠️ STRIPE_SECRET_KEY no configurada - mostrando "próximamente"')

      return NextResponse.json({
        success: false,
        error: 'Pagos con tarjeta: Próximamente disponible. Por favor intenta más tarde o contáctanos.',
      }, { status: 503 })
    }

    // Implementación real con Stripe:
    // const stripe = require('stripe')(STRIPE_SECRET_KEY)
    //
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: data.currency || 'mxn',
    //         product_data: {
    //           name: 'Urbánika Investment NFT',
    //           description: `Inversión de $${data.amount} MXN con retorno esperado de $${data.metadata.expectedReturn} MXN`,
    //           images: ['https://urbanika.xyz/nft-image.png'],
    //         },
    //         unit_amount: data.amount * 100, // Stripe usa centavos
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/nft/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/nft`,
    //   customer_email: data.email,
    //   metadata: {
    //     investmentAmount: data.metadata.investmentAmount.toString(),
    //     expectedReturn: data.metadata.expectedReturn.toString(),
    //     timestamp: data.metadata.timestamp,
    //   },
    // })
    //
    // return NextResponse.json({
    //   success: true,
    //   url: session.url,
    //   sessionId: session.id,
    // })

    console.log('Intento de pago con Stripe:', {
      amount: data.amount,
      email: data.email,
      metadata: data.metadata,
    })

    return NextResponse.json({
      success: false,
      error: 'Pagos con tarjeta: Próximamente disponible. Por favor intenta más tarde o contáctanos.',
    }, { status: 503 })

  } catch (error) {
    console.error('Error creando checkout de Stripe:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
