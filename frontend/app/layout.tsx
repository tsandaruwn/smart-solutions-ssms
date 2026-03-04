import './globals.css'

export const metadata = {
  title: 'Product Management System',
  description: 'Smart Home Product Management',
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

