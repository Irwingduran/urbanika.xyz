import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.amountMXN || !data.email || !data.cryptocurrency) {
      return NextResponse.json(
        { error: 'AmountMXN, email y cryptocurrency son requeridos' },
        { status: 400 }
      )
    }

    // TODO: Implementar integración real con procesador de pagos crypto
    // Opciones:
    // - Coinbase Commerce: https://commerce.coinbase.com/
    // - NOWPayments: https://nowpayments.io/
    // - BTCPay Server: https://btcpayserver.org/

    console.warn('⚠️ Crypto payment no está configurado - usando modo demo')

    console.log('Intento de pago crypto:', {
      amountMXN: data.amountMXN,
      cryptocurrency: data.cryptocurrency,
      email: data.email,
      metadata: data.metadata,
    })

    // Conversión aproximada MXN -> USD -> Crypto (Scroll Mainnet)
    const MXN_TO_USD = 0.054283
    const amountUSD = data.amountMXN * MXN_TO_USD

    let amountCrypto: number
    let cryptoSymbol: string
    switch (data.cryptocurrency) {
      case 'USDC':
      case 'USDT':
        amountCrypto = amountUSD
        cryptoSymbol = data.cryptocurrency
        break
      case 'ETH':
        // ETH en Scroll Mainnet (precio aproximado de ETH)
        amountCrypto = amountUSD / 4027 // Aproximado - usar precio real en producción
        cryptoSymbol = 'ETH'
        break
      default:
        amountCrypto = amountUSD
        cryptoSymbol = data.cryptocurrency
    }

    console.log('Pago crypto en Scroll Mainnet:', {
      amountMXN: data.amountMXN,
      amountUSD: amountUSD.toFixed(2),
      amountCrypto: amountCrypto.toFixed(6),
      cryptocurrency: cryptoSymbol,
      network: 'Scroll Mainnet',
    })

    // Mock data - en producción esto vendría del procesador de pagos
    const paymentId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: false,
      error: 'Pagos con criptomonedas: Próximamente disponible. Por favor intenta más tarde o contáctanos.',
      // Para desarrollo:
      // paymentAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      // amountCrypto: amountCrypto,
      // paymentId: paymentId,
      // qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`,
    }, { status: 503 })

  } catch (error) {
    console.error('Error creando pago crypto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
