import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para configurar Content Security Policy (CSP) con nonces
 *
 * Esta implementación es MÁS SEGURA que usar 'unsafe-eval' porque:
 * 1. Genera un nonce único por cada request
 * 2. Solo permite scripts que incluyan ese nonce específico
 * 3. No permite evaluación dinámica de código arbitrario
 *
 * Compatible con:
 * - Wagmi/Viem (Web3)
 * - WalletConnect
 * - Vercel Analytics
 */

export function middleware(request: NextRequest) {
  // Generar un nonce único para esta request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Configurar CSP segura sin unsafe-eval
  const cspHeader = [
    "default-src 'self'",
    // Scripts: permitir self, nonce, y dominios específicos confiables
    // NO incluimos 'unsafe-eval' ni 'unsafe-inline'
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    // Estilos: permitir inline necesario para styled-components y Tailwind
    "style-src 'self' 'unsafe-inline'",
    // Imágenes: permitir todas las fuentes HTTPS, data URIs, y blobs
    "img-src 'self' data: https: blob:",
    // Fuentes
    "font-src 'self' data:",
    // Conexiones: Web3 RPCs, WalletConnect, Analytics
    "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.reown.com wss://*.walletconnect.com wss://*.walletconnect.org wss://*.reown.com https://rpc.scroll.io https://scroll.blockpi.network https://scroll-mainnet.public.blastapi.io https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.scrollscan.com https://scrollscan.com https://api.coingecko.com https://pinata.cloud https://*.pinata.cloud https://gateway.pinata.cloud",
    // Frames: WalletConnect modal
    "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org https://verify.reown.com",
    // Workers: necesario para Web3
    "worker-src 'self' blob:",
    // WebAssembly: necesario para algunas operaciones crypto
    "script-src-elem 'self' 'nonce-${nonce}' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    // Object src
    "object-src 'none'",
    // Base URI
    "base-uri 'self'",
    // Form actions
    "form-action 'self'",
    // Frame ancestors (prevenir clickjacking)
    "frame-ancestors 'none'",
    // Upgrade insecure requests
    "upgrade-insecure-requests",
  ].join('; ')

  // Crear response con headers de seguridad
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Aplicar headers de seguridad
  response.headers.set('Content-Security-Policy', cspHeader)

  // Headers de seguridad adicionales
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  return response
}

// Configurar en qué rutas aplicar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|logo.svg|nft-image.png).*)',
  ],
}
