import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Urbánika',
  description: 'Urbanika is a platform that allows users to create and manage their urban spaces.',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
