import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

/**
 * Middleware de autenticación para proteger endpoints de API
 *
 * Métodos de autenticación (en orden de prioridad):
 * 1. API key secreta (x-api-key header)
 * 2. Same-origin requests (mismo dominio en producción o localhost en desarrollo)
 *
 * Seguridad adicional:
 * - Rate limiting (configurable por endpoint)
 * - Validación de origin/referer headers
 * - Restricción a dominios específicos en producción
 */

// Función para verificar la API key
export function verifyApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false

  const validApiKey = process.env.API_SECRET_KEY
  if (!validApiKey) {
    // En desarrollo, advertir si no hay API key configurada
    if (process.env.NODE_ENV === 'development') {
      return true // Solo en desarrollo
    }
    return false
  }

  // Comparación segura para prevenir timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(apiKey),
    Buffer.from(validApiKey)
  )
}

/**
 * Middleware para proteger rutas de API
 * Uso:
 * const isAuthenticated = await authenticateRequest(request)
 * if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 */
export async function authenticateRequest(request: NextRequest): Promise<boolean> {
  // Verificar API key en headers
  const apiKey = request.headers.get('x-api-key')

  if (verifyApiKey(apiKey)) {
    return true
  }

  // Verificar si es una petición interna (desde el mismo dominio)
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const referer = request.headers.get('referer')

  // En desarrollo, permitir peticiones desde localhost
  if (process.env.NODE_ENV === 'development') {
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return true
    }
  }

  // En producción, permitir peticiones same-origin (mismo dominio)
  if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = [
      `https://${host}`,
      'https://urbanika.xyz',
      'https://www.urbanika.xyz'
    ]

    // Verificar origin header
    if (origin && allowedOrigins.some(allowed => origin === allowed)) {
      return true
    }

    // Fallback: verificar referer header (para navegadores que no envían origin)
    if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed))) {
      return true
    }
  }

  return false
}

/**
 * Generar un CSRF token para protección adicional
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Rate limiting básico (usar con Redis en producción)
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Limpiar entradas antiguas
  if (record && now - record.timestamp > windowMs) {
    rateLimitMap.delete(identifier)
  }

  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

/**
 * Middleware completo con autenticación y rate limiting
 */
export async function protectedApiRoute(
  request: NextRequest,
  options?: {
    rateLimit?: { maxRequests: number; windowMs: number }
    requireApiKey?: boolean
  }
): Promise<{ authorized: boolean; response?: NextResponse }> {
  // Rate limiting
  if (options?.rateLimit) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limited = !checkRateLimit(
      ip,
      options.rateLimit.maxRequests,
      options.rateLimit.windowMs
    )

    if (limited) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
    }
  }

  // Autenticación
  const authenticated = await authenticateRequest(request)

  if (!authenticated) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return { authorized: true }
}