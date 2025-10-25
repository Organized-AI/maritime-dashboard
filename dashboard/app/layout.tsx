import type { Metadata } from 'next'
import './globals.css'
import './dark-mode.css'
import { ThemeProvider } from '@/lib/ThemeContext'

export const metadata: Metadata = {
  title: 'Maritime AI Dashboard - Digital Twin of the Oceans',
  description: 'Vessel Intelligence & Safety System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
