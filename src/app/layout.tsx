import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LibreScholar',
  description: 'Open source scholarly literature search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
