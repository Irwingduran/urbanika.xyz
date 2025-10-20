/**
 * Email Service usando Resend
 *
 * Servicios de email para notificar a los usuarios sobre sus NFTs
 * y mantener comunicación con los leads.
 */

import { Resend } from 'resend'

// Inicializar Resend con API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Configuración de emails
const EMAIL_FROM = process.env.EMAIL_FROM || 'Urbanika <noreply@urbanika.xyz>'
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || 'contacto@urbanika.xyz'

export type EmailType = 'welcome' | 'nft_ready' | 'payment_pending' | 'reminder'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  type?: EmailType
}

/**
 * Envía un email usando Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  type,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no está configurado. Email no enviado.')
      return {
        success: false,
        error: 'RESEND_API_KEY no configurado',
      }
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      replyTo: EMAIL_REPLY_TO,
    })

    if (error) {
      console.error('❌ Error enviando email:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log(`✅ Email enviado (${type || 'generic'}):`, {
      to,
      subject,
      messageId: data?.id,
    })

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error('❌ Error crítico enviando email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Email de bienvenida cuando un usuario deja sus datos
 */
export async function sendWelcomeEmail(to: string, name?: string): Promise<{ success: boolean; error?: string }> {
  const displayName = name || 'Inversionista'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a Urbanika! 🏢</h1>
          </div>
          <div class="content">
            <p>Hola ${displayName},</p>

            <p>Gracias por tu interés en invertir en bienes raíces tokenizados con Urbanika.</p>

            <p>Hemos recibido tu información de contacto y pronto nos comunicaremos contigo para ayudarte a completar tu inversión y obtener tu NFT.</p>

            <h3>¿Qué sigue?</h3>
            <ul>
              <li>Revisaremos tu solicitud</li>
              <li>Te contactaremos para confirmar los detalles de tu inversión</li>
              <li>Una vez confirmado el pago, recibirás tu NFT directamente en tu wallet</li>
            </ul>

            <p>Si tienes alguna pregunta, no dudes en responder a este email.</p>

            <a href="https://urbanika.xyz/nft" class="button">Ver más información</a>

            <p>¡Gracias por confiar en Urbanika!</p>
            <p><strong>El equipo de Urbanika</strong></p>
          </div>
          <div class="footer">
            <p>Urbanika - Inversión inmobiliaria tokenizada</p>
            <p>Este es un email automático. Si tienes dudas, responde a este correo.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const result = await sendEmail({
    to,
    subject: '¡Bienvenido a Urbanika! Tu inversión en NFTs inmobiliarios',
    html,
    type: 'welcome',
  })

  return result
}

/**
 * Email cuando el NFT está listo para ser entregado
 */
export async function sendNFTReadyEmail(
  to: string,
  data: {
    name?: string
    tokenId: string
    txHash: string
    investmentAmount: number
  }
): Promise<{ success: boolean; error?: string }> {
  const displayName = data.name || 'Inversionista'
  const explorerUrl = `https://scrollscan.com/tx/${data.txHash}`
  const openseaUrl = `https://opensea.io/assets/scroll/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${data.tokenId}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .nft-card { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .button-secondary { background: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Tu NFT ha sido minteado!</h1>
          </div>
          <div class="content">
            <p>Hola ${displayName},</p>

            <p><strong>¡Excelentes noticias!</strong> Tu inversión ha sido procesada y tu NFT de Urbanika ya está en tu wallet.</p>

            <div class="nft-card">
              <h3>Detalles de tu NFT</h3>
              <p><strong>Token ID:</strong> #${data.tokenId}</p>
              <p><strong>Inversión:</strong> $${data.investmentAmount.toLocaleString('es-MX')} MXN</p>
              <p><strong>Network:</strong> Scroll Mainnet</p>
              <p><strong>Transaction:</strong> <a href="${explorerUrl}">Ver en explorador</a></p>
            </div>

            <h3>¿Qué puedes hacer ahora?</h3>
            <ul>
              <li>Ver tu NFT en OpenSea</li>
              <li>Agregarlo a tu colección en tu wallet (MetaMask, Rainbow, etc.)</li>
              <li>Recibir rendimientos según los términos de tu inversión</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${openseaUrl}" class="button">Ver en OpenSea</a>
              <a href="${explorerUrl}" class="button button-secondary">Ver transacción</a>
            </div>

            <p>Si tienes alguna pregunta sobre tu NFT o tu inversión, no dudes en contactarnos.</p>

            <p>¡Gracias por invertir con Urbanika!</p>
            <p><strong>El equipo de Urbanika</strong></p>
          </div>
          <div class="footer">
            <p>Urbanika - Inversión inmobiliaria tokenizada</p>
          </div>
        </div>
      </body>
    </html>
  `

  const result = await sendEmail({
    to,
    subject: `🎉 Tu NFT de Urbanika ha sido minteado - Token #${data.tokenId}`,
    html,
    type: 'nft_ready',
  })

  return result
}

/**
 * Email recordatorio cuando el pago está pendiente
 */
export async function sendPaymentReminderEmail(to: string, name?: string): Promise<{ success: boolean; error?: string }> {
  const displayName = name || 'Inversionista'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Completa tu inversión en Urbanika</h1>
          </div>
          <div class="content">
            <p>Hola ${displayName},</p>

            <p>Notamos que iniciaste el proceso de inversión en Urbanika pero aún no has completado el pago.</p>

            <p>¿Necesitas ayuda? Estamos aquí para asistirte con cualquier duda sobre:</p>
            <ul>
              <li>Proceso de pago con criptomonedas</li>
              <li>Configuración de tu wallet</li>
              <li>Detalles sobre tu inversión</li>
            </ul>

            <a href="https://urbanika.xyz/nft" class="button">Completar mi inversión</a>

            <p>Si ya completaste tu pago, ignora este mensaje. Tu NFT será procesado en breve.</p>

            <p>¿Tienes preguntas? Simplemente responde a este email y te ayudaremos.</p>

            <p>Saludos,<br><strong>El equipo de Urbanika</strong></p>
          </div>
          <div class="footer">
            <p>Urbanika - Inversión inmobiliaria tokenizada</p>
          </div>
        </div>
      </body>
    </html>
  `

  const result = await sendEmail({
    to,
    subject: 'Completa tu inversión en Urbanika 🏢',
    html,
    type: 'reminder',
  })

  return result
}

/**
 * Helper: Elimina HTML tags para crear versión texto plano
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
