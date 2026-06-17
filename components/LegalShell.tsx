import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LegalShell({
  title,
  updatedAt,
  children,
}: {
  title: string
  updatedAt: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/70 hover:text-white transition-colors">
          <Logo size={28} glow={false} />
          <span className="font-semibold">AI Lover</span>
        </Link>
        <h1 className="text-3xl font-bold gradient-text mb-2">{title}</h1>
        <p className="text-sm text-white/55 mb-10">最終改定日：{updatedAt}</p>
        <div className="legal-body space-y-6 text-white/85 leading-relaxed">
          {children}
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 text-sm text-white/55 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
          <Link href="/tokushoho" className="hover:text-white transition-colors">特定商取引法に基づく表記</Link>
          <Link href="/" className="hover:text-white transition-colors">トップへ戻る</Link>
        </div>
      </div>
    </main>
  )
}
