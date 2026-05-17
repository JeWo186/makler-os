import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MaklerOS – Das Branchenbuch für Immobilienmakler in Deutschland',
    template: '%s | MaklerOS',
  },
  description:
    'Finden Sie den richtigen Immobilienmakler in Ihrer Stadt. Verifizierte Profile, echte Bewertungen, kostenlose Immobilienbewertung.',
  keywords: ['Immobilienmakler', 'Makler finden', 'Immobilien', 'Branchenbuch', 'Deutschland'],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'MaklerOS',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
