import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SITE } from '@/lib/site'
import { ProgressProvider } from '@/context/ProgressContext'
import Nav from '@/components/Nav'
import SwRegister from '@/components/SwRegister'

export const metadata: Metadata = {
  title: { default: `${SITE.brand} — ${SITE.tagline}`, template: `%s | ${SITE.brand}` },
  description: SITE.description,
  applicationName: SITE.brand,
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: SITE.brand, statusBarStyle: 'default' },
}
export const viewport: Viewport = { themeColor: '#6C5CE7', width: 'device-width', initialScale: 1, maximumScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ProgressProvider>
          <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-28 pt-4">{children}</main>
          <Nav />
          <SwRegister />
        </ProgressProvider>
      </body>
    </html>
  )
}
