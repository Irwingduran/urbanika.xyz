import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para Next.js
 *
 * NOTA: Los headers de seguridad (CSP, X-Frame-Options, etc.) están configurados
 * en vercel.json para evitar conflictos y asegurar consistencia en producción.
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Otros middlewares pueden ir aquí si es necesario
  // Pero NO configurar CSP aquí para evitar conflictos con vercel.json

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
