import type { Metadata } from 'next'
import { Playfair_Display, Dancing_Script } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing',
})

export const metadata: Metadata = {
  title: 'Happy Birthday Yazhini!',
  description: 'A special birthday website for a special person',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dancing.variable}`}>
      <body>{children}</body>
    </html>
  )
} 