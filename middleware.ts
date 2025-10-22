import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para configurar Content Security Policy (CSP) balanceada
 *
 * Esta implementación balancea seguridad y funcionalidad:
 * 1. Permite 'unsafe-eval' necesario para Web3 (WalletConnect, Wagmi, Viem)
 * 2. Permite 'unsafe-inline' necesario para Next.js y React
 * 3. Limita estrictamente los dominios permitidos (whitelist)
 * 4. Mantiene otras protecciones importantes (XSS, clickjacking, etc.)
 *
 * Compatible con:
 * - Next.js (scripts inline automáticos)
 * - React (event handlers inline)
 * - Wagmi/Viem (Web3)
 * - WalletConnect
 * - Vercel Analytics
 */

export function middleware(request: NextRequest) {
  // Configurar CSP balanceada con unsafe-eval y unsafe-inline
  const cspHeader = [
    "default-src 'self'",
    // Scripts: permitir eval e inline SOLO para funcionalidad Web3 y Next.js
    // Limitamos los dominios externos a servicios confiables
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    // Estilos: permitir inline necesario para Tailwind y componentes
    "style-src 'self' 'unsafe-inline'",
    // Imágenes: permitir todas las fuentes HTTPS, data URIs, y blobs
    "img-src 'self' data: https: blob:",
    // Fuentes
    "font-src 'self' data:",
    // Conexiones: whitelist estricta de servicios Web3 y Analytics
    "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.reown.com wss://*.walletconnect.com wss://*.walletconnect.org wss://*.reown.com https://rpc.scroll.io https://scroll.blockpi.network https://scroll-mainnet.public.blastapi.io https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.scrollscan.com https://scrollscan.com https://api.coingecko.com https://pinata.cloud https://*.pinata.cloud https://gateway.pinata.cloud",
    // Frames: WalletConnect modal
    "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org https://verify.reown.com",
    // Workers: necesario para Web3
    "worker-src 'self' blob:",
    // Object src: bloquear objetos embebidos
    "object-src 'none'",
    // Base URI: solo mismo origen
    "base-uri 'self'",
    // Form actions: solo mismo origen
    "form-action 'self'",
    // Frame ancestors: prevenir clickjacking
    "frame-ancestors 'none'",
    // Upgrade insecure requests
    "upgrade-insecure-requests",
  ].join('; ')

  const response = NextResponse.next()

  // Aplicar CSP
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
