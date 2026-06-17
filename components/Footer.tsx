import Link from 'next/link'

/**
 * 公開用フッター。規約類・年齢注記・問い合わせへの導線。
 * トップ／ログイン等の公開ページに設置する。
 */
export default function Footer() {
  return (
    <footer className="relative z-10 w-full px-6 py-8 mt-auto">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/60">
          <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
          <Link href="/tokushoho" className="hover:text-white transition-colors">特定商取引法に基づく表記</Link>
          <a href="mailto:support@example.com" className="hover:text-white transition-colors">お問い合わせ</a>
        </div>
        <p className="text-xs text-white/40">
          本サービスは18歳以上の方を対象としています。© 2026 AI Lover
        </p>
      </div>
    </footer>
  )
}
