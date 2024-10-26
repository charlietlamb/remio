import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Providers from '@/components/providers/Providers'
import { Bricolage_Grotesque } from 'next/font/google'
import useAuth from '@/hooks/use-auth'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
})

export const metadata: Metadata = {
  title: 'Remio',
  description: 'Remio',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await useAuth()
  return (
    <html lang="en">
      <Providers
        user={user}
        className={`${geistSans.variable} ${bricolageGrotesque.variable} antialiased flex flex-col min-h-screen relative`}
      >
        {children}
      </Providers>
    </html>
  )
}
