/**
 * Analytics Helper for Urbanika
 *
 * Centraliza el tracking de eventos importantes para analytics.
 * Compatible con Vercel Analytics, Google Analytics, y otros.
 */

import { track } from '@vercel/analytics'

export type AnalyticsEvent =
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'network_switched'
  | 'investment_started'
  | 'investment_amount_selected'
  | 'contact_info_submitted'
  | 'payment_method_selected'
  | 'nft_mint_initiated'
  | 'nft_mint_success'
  | 'nft_mint_failed'
  | 'transaction_confirmed'
  | 'page_view'
  | 'cta_clicked'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

/**
 * Track event usando Vercel Analytics
 */
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  try {
    // Vercel Analytics
    track(event, properties)

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event, properties)
    }

    // Aquí puedes agregar otros servicios de analytics
    // Example: Google Analytics
    // if (typeof window !== 'undefined' && (window as any).gtag) {
    //   (window as any).gtag('event', event, properties)
    // }
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

/**
 * Track wallet connection
 */
export function trackWalletConnected(address: string, chainId: number) {
  trackEvent('wallet_connected', {
    address: `${address.slice(0, 6)}...${address.slice(-4)}`,
    chainId,
  })
}

/**
 * Track wallet disconnection
 */
export function trackWalletDisconnected() {
  trackEvent('wallet_disconnected')
}

/**
 * Track network switch
 */
export function trackNetworkSwitch(fromChainId: number, toChainId: number) {
  trackEvent('network_switched', {
    from: fromChainId,
    to: toChainId,
  })
}

/**
 * Track investment flow
 */
export function trackInvestmentStarted() {
  trackEvent('investment_started')
}

export function trackInvestmentAmount(amount: number, tier?: string) {
  trackEvent('investment_amount_selected', {
    amount,
    tier: tier || 'custom',
  })
}

export function trackContactInfoSubmitted(investmentAmount: number) {
  trackEvent('contact_info_submitted', {
    investmentAmount,
  })
}

export function trackPaymentMethodSelected(method: 'stripe' | 'crypto') {
  trackEvent('payment_method_selected', {
    method,
  })
}

/**
 * Track NFT minting
 */
export function trackNFTMintInitiated(
  investmentAmount: number,
  paymentMethod: 'stripe' | 'crypto'
) {
  trackEvent('nft_mint_initiated', {
    investmentAmount,
    paymentMethod,
  })
}

export function trackNFTMintSuccess(
  investmentAmount: number,
  transactionHash: string,
  chainId: number
) {
  trackEvent('nft_mint_success', {
    investmentAmount,
    transactionHash: `${transactionHash.slice(0, 10)}...`,
    chainId,
  })
}

export function trackNFTMintFailed(
  investmentAmount: number,
  errorType: string,
  errorMessage?: string
) {
  trackEvent('nft_mint_failed', {
    investmentAmount,
    errorType,
    errorMessage: errorMessage?.slice(0, 100), // Limitar tamaño
  })
}

/**
 * Track transaction confirmation
 */
export function trackTransactionConfirmed(
  transactionHash: string,
  confirmations: number
) {
  trackEvent('transaction_confirmed', {
    transactionHash: `${transactionHash.slice(0, 10)}...`,
    confirmations,
  })
}

/**
 * Track page views
 */
export function trackPageView(page: string) {
  trackEvent('page_view', {
    page,
  })
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(ctaName: string, location?: string) {
  trackEvent('cta_clicked', {
    ctaName,
    location,
  })
}
