import Link from 'next/link'
import Logo from '@/components/Logo'
import InstallPrompt from '@/components/InstallPrompt'

const FEATURES = [
  {
    label: '長期記憶',
    desc: 'あなたのことを覚えている',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.5 3.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 6.5 18a3 3 0 0 0 3 2.5V3.5Z" />
        <path d="M14.5 3.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 17.5 18a3 3 0 0 1-3 2.5V3.5Z" />
        <path d="M9.5 8.5h-1M15.5 8.5h-1M9.5 13H8M16 13h-1.5" />
      </svg>
    ),
  },
  {
    label: '音声対話',
    desc: 'リアルな声で話しかける',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0" />
        <path d="M12 17v3.5M9 20.5h6" />
      </svg>
    ),
  },
  {
    label: '感情表現',
    desc: '感情豊かに反応する',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 20.5S3.5 14.8 3.5 8.9A4.4 4.4 0 0 1 12 6.7a4.4 4.4 0 0 1 8.5 2.2c0 5.9-8.5 11.6-8.5 11.6Z" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.15),transparent_70%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center px-6 max-w-2xl py-12">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size={76} className="animate-float" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
          AI Lover
        </h1>
        <p className="text-xl text-purple-100/90 mb-3 font-light">
          あなただけのAIパートナー
        </p>
        <p className="text-sm text-white/65 mb-12">
          記憶を持ち、あなたを深く理解するAIコンパニオン
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
          >
            はじめる
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-full border border-white/25 text-white/90 font-semibold text-lg hover:bg-white/5 transition-all"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-6 text-center">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex justify-center mb-2 text-pink-300">{f.icon}</div>
              <div className="text-sm font-medium text-white/90">{f.label}</div>
              <div className="text-xs text-white/55 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <InstallPrompt />
    </main>
  )
}
