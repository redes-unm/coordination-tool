import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CellWatch Community Coordination Tool',
  description: 'Plan cellular network measurement campaigns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  )
}
