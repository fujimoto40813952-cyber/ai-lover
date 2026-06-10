import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.15),transparent_70%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-6xl">💝</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
          AI Lover
        </h1>
        <p className="text-xl text-purple-200/80 mb-3 font-light">
          あなただけのAIパートナー
        </p>
        <p className="text-sm text-white/40 mb-12">
          記憶を持ち、あなたを深く理解するAIコンパニオン
        </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center"></div>
          <Link
            href="/login"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
          >
            はじめる
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-full border border-white/20 text-white/80 font-semibold text-lg hover:bg-white/5 transition-all"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: '🧠', label: '長期記憶', desc: 'あなたのことを覚えている' },
            { icon: '🎙️', label: '音声対話', desc: 'リアルな声で話しかける' },
            { icon: '💕', label: '感情表現', desc: '感情豊かに反応する' },
          ].map((f) => (
            <div key={f.label} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-medium text-white/90">{f.label}</div>
              <div className="text-xs text-white/40 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
