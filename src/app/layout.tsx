// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MapleKaede - Premium MapleStory v83 Server',
  description: 'Experience MapleStory v83 reimagined with modern gameplay, stunning visuals, and an incredible community.',
  keywords: 'MapleStory, v83, private server, MMORPG, MapleKaede',
  authors: [{ name: 'MapleKaede Team' }],
  openGraph: {
    title: 'MapleKaede - Premium MapleStory v83 Server',
    description: 'Join thousands of players in the ultimate MapleStory v83 experience.',
    type: 'website',
    locale: 'en_US',
    siteName: 'MapleKaede',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MapleKaede - Premium MapleStory v83 Server',
    description: 'Join thousands of players in the ultimate MapleStory v83 experience.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#9333ea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}