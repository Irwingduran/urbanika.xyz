import type { Metadata } from 'next'
import './globals.css'
import SocialMediaButtons from '@/components/social-media-buttons'
import { Web3Provider } from '@/lib/web3/providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ClientErrorHandler } from './client-error-handler'

export const metadata: Metadata = {
  title: 'Urbánika - Invierte en Casas Regenerativas con NFTs',
  description: 'Invierte en proyectos de vivienda regenerativa y recibe retornos del 50% a través de NFTs en la blockchain de Scroll. Inversión mínima desde $250 MXN.',
  keywords: [
    'inversión inmobiliaria',
    'NFT',
    'blockchain',
    'vivienda regenerativa',
    'Scroll',
    'Web3',
    'criptomonedas',
    'tokenización',
    'bienes raíces',
  ],
  authors: [{ name: 'Urbánika' }],
  creator: 'Urbánika',
  publisher: 'Urbánika',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://urbanika.xyz',
    siteName: 'Urbánika',
    title: 'Urbánika - Invierte en Casas Regenerativas con NFTs',
    description: 'Invierte en proyectos de vivienda regenerativa y recibe retornos del 50% a través de NFTs en la blockchain de Scroll.',
    images: [
      {
        url: '/nft-image.png',
        width: 1200,
        height: 630,
        alt: 'Urbánika - Inversión en Vivienda Regenerativa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urbánika - Invierte en Casas Regenerativas con NFTs',
    description: 'Invierte en proyectos de vivienda regenerativa y recibe retornos del 50% a través de NFTs.',
    images: ['/nft-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#00BFA6',
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <ClientErrorHandler />
        <Web3Provider>
          {children}
          <SocialMediaButtons />
        </Web3Provider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
