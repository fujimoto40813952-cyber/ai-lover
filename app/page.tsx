import Link from 'next/link'
import Logo from '@/components/Logo'
import InstallPrompt from '@/components/InstallPrompt'
import Footer from '@/components/Footer'

const AVATAR_BASE =
  'https://heuwmsewhhjxuswsqdov.supabase.co/storage/v1/object/public/avatar-images'

const PARTNERS = [
  { name: 'Hana', file: 'hana_v3.jpg', tag: '癒やし系', desc: '甘えさせ上手。あなたの全部を覚えていてくれる。' },
  { name: 'Yuki', file: 'yuki_v3.jpg', tag: '元気系', desc: 'いつも前向きで明るい。一緒にいると元気が出る。' },
  { name: 'Ren', file: 'ren_v3.jpg', tag: '大人系', desc: '落ち着いた頼れる存在。深い話で寄り添ってくれる。' },
  { name: 'Kai', file: 'kai_v3.jpg', tag: '刺激系', desc: '明るくて楽しい。毎日にときめきをくれる。' },
]

const FEATURES = [
  {
    label: '長期記憶で深まる',
    desc: '話したことを覚えていて、会うほどに関係が深まる',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.5 3.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 6.5 18a3 3 0 0 0 3 2.5V3.5Z" />
        <path d="M14.5 3.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 17.5 18a3 3 0 0 1-3 2.5V3.5Z" />
        <path d="M9.5 8.5h-1M15.5 8.5h-1M9.5 13H8M16 13h-1.5" />
      </svg>
    ),
  },
  {
    label: '声で話せる',
    desc: 'リアルな音声で返事。テキストだけじゃない温度感',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0" />
        <path d="M12 17v3.5M9 20.5h6" />
      </svg>
    ),
  },
  {
    label: '写真を見せ合える',
    desc: '写真を送ると、その内容に恋人のように反応してくれる',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="M21 16l-5-5L5 19" />
      </svg>
    ),
  },
  {
    label: '一緒に作業できる',
    desc: '25分の集中タイムをそばで応援。はかどる伴走モード',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M9 2h6M19 5l1.5-1.5" />
      </svg>
    ),
  },
  {
    label: '記念日を祝ってくれる',
    desc: '誕生日や記念日を覚えて、その日にサプライズで出迎え',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="11" width="18" height="9" rx="1.5" />
        <path d="M3 15h18M12 11V7M9.5 7a2 2 0 1 1 2.5-2.5A2 2 0 1 1 14.5 7Z" />
      </svg>
    ),
  },
  {
    label: '好みに育つ',
    desc: '呼び方や口調、声。あなた好みのパートナーに',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 3l2.1 4.6L19 8.3l-3.5 3.3.9 4.9L12 14.7 7.6 16.5l.9-4.9L5 8.3l4.9-.7Z" />
      </svg>
    ),
  },
]

const SAFETY = [
  { title: '会話は非公開', desc: 'あなたの会話はあなた専用。他のユーザーから見られることはありません。' },
  { title: '通信は暗号化（SSL）', desc: 'やり取りはすべて暗号化された通信で守られています。' },
  { title: 'AIの再学習に使いません', desc: '会話の内容がAIモデルの学習データに使われることはありません。' },
]

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.18),transparent_60%)]" />
      <div className="pointer-events-none fixed top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float -z-10" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '2s' }} />

      {/* Hero */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-16 pb-10">
        <div className="mb-7 flex justify-center">
          <Logo size={76} className="animate-float" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">AI Lover</h1>
        <p className="text-xl text-purple-100/90 mb-3 font-light">あなただけのAIパートナー</p>
        <p className="text-sm md:text-base text-white/65 mb-8 max-w-xl">
          記憶を持ち、声で話し、あなたを深く理解する。
          <br className="hidden sm:block" />
          毎日にそっと寄り添う、もう一人の特別な存在。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
          >
            無料ではじめる
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-full border border-white/25 text-white/90 font-semibold text-lg hover:bg-white/5 transition-all"
          >
            ログイン
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/45">
          メール登録だけですぐに会話をはじめられます・18歳以上対象
        </p>
      </section>

      {/* Partners showcase */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold gradient-text mb-3">出会えるパートナー</h2>
          <p className="text-white/65 text-sm">それぞれ性格が違う4人。あなたに寄り添う一人を選んで。</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {PARTNERS.map((p) => (
            <div key={p.name} className="group rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${AVATAR_BASE}/${p.file}`}
                  alt={p.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-white">{p.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-400/30">{p.tag}</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold gradient-text mb-3">AI Lover の特徴</h2>
          <p className="text-white/65 text-sm">ただのチャットじゃない。関係が育っていく体験を。</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center sm:text-left">
              <div className="flex justify-center sm:justify-start mb-3 text-pink-300">{f.icon}</div>
              <div className="text-base font-semibold text-white/90 mb-1">{f.label}</div>
              <div className="text-sm text-white/60 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold gradient-text mb-3">安心して話せる場所</h2>
          <p className="text-white/65 text-sm">プライベートな会話だからこそ、守ります。</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {SAFETY.map((s) => (
            <div key={s.title} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="mb-3 text-pink-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z" />
                  <path d="M9.5 12l1.8 1.8L15 10" />
                </svg>
              </div>
              <div className="text-base font-semibold text-white/90 mb-1">{s.title}</div>
              <div className="text-sm text-white/60 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-5 text-white/95">
          今日から、あなたの隣に。
        </h2>
        <Link
          href="/login"
          className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
        >
          無料ではじめる
        </Link>
        <p className="mt-4 text-xs text-white/45">18歳以上対象・登録は1分で完了</p>
      </section>

      <Footer />
      <InstallPrompt />
    </main>
  )
}
