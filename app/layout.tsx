import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Lover - あなただけのAIパートナー',
  description: 'AIとの深い絆を築く、次世代のコンパニオン体験',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#0f0a1e]">
        {children}
      </body>
    </html>
  )
}
