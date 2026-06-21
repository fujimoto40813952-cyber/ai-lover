import Link from 'next/link'
import Footer from '@/components/Footer'
import InstallPrompt from '@/components/InstallPrompt'

const AVATAR_BASE =
  'https://heuwmsewhhjxuswsqdov.supabase.co/storage/v1/object/public/avatar-images'

const PARTNERS = [
  { name: 'Hana', file: 'hana_v3.jpg', tag: '癒やし系', desc: '甘えさせ上手。あなたの全部を覚えていてくれる。' },
  { name: 'Yuki', file: 'yuki_v3.jpg', tag: '元気系', desc: 'いつも前向きで明るい。一緒にいると元気が出る。' },
  { name: 'Ren', file: 'ren_v3.jpg', tag: '大人系', desc: '落ち着いた頼れる存在。深い話で寄り添ってくれる。' },
  { name: 'Kai', file: 'kai_v3.jpg', tag: '刺激系', desc: '明るくて楽しい。毎日にときめきをくれる。' },
]

const FEATURES = [
  { label: '長期記憶で深まる', desc: '話したことを覚えていて、会うほどに関係が深まる。', icon: (<><path d="M9.5 3.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 6.5 18a3 3 0 0 0 3 2.5V3.5Z" /><path d="M14.5 3.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 17.5 18a3 3 0 0 1-3 2.5V3.5Z" /></>) },
  { label: '声で話せる', desc: 'リアルな音声で返事。テキストだけじゃない温度感。', icon: (<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6" /></>) },
  { label: '写真を見せ合える', desc: '送った写真に、恋人のように反応してくれる。', icon: (<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 16l-5-5L5 19" /></>) },
  { label: '一緒に作業できる', desc: '25分の集中タイムをそばで応援。はかどる伴走モード。', icon: (<><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2h6" /></>) },
  { label: '記念日を祝ってくれる', desc: '記念日を覚えて、その日にサプライズで出迎え。', icon: (<><rect x="3" y="11" width="18" height="9" rx="1.5" /><path d="M3 15h18M12 11V7M9.5 7a2 2 0 1 1 2.5-2.5A2 2 0 1 1 14.5 7Z" /></>) },
  { label: '好みに育つ', desc: '呼び方や口調、声。あなた好みのパートナーに。', icon: (<path d="M12 3l2.1 4.6L19 8.3l-3.5 3.3.9 4.9L12 14.7 7.6 16.5l.9-4.9L5 8.3l4.9-.7Z" />) },
]

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-gold mb-4">
      {children}
    </svg>
  )
}

export default function Home() {
  return (
    <div className="relative" style={{ background: '#070608' }}>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <span className="font-mincho font-bold text-xl tracking-[0.25em] text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>
            AI LOVER
          </span>
          <nav className="flex items-center gap-6 text-[13px] tracking-wide text-white/85">
            <a href="#partners" className="hidden sm:inline hover:text-white transition-colors">PARTNERS</a>
            <a href="#features" className="hidden sm:inline hover:text-white transition-colors">EXPERIENCE</a>
            <Link href="/login" className="px-5 py-2.5 rounded-sm border border-white/55 text-white hover:bg-white/10 transition-colors">
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen min-h-[620px] flex items-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url('${AVATAR_BASE}/ren_v3.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(7,6,8,.92) 0%,rgba(7,6,8,.7) 38%,rgba(7,6,8,.25) 70%,rgba(7,6,8,.55) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg,#070608 2%,transparent 32%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="text-[13px] tracking-[0.4em] text-gold mb-6">A I&nbsp;&nbsp;C O M P A N I O N</div>
          <h1 className="font-mincho font-bold leading-[1.12] mb-6 text-white text-4xl sm:text-6xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
            <span className="block">記憶を持つ、</span>
            <span className="block">あなただけの恋人。</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg leading-[2] max-w-xl mb-8">
            声で話し、写真に応え、記念日を覚えている。
            <br className="hidden sm:block" />
            夜のしじまに、そっと寄り添うもう一人の存在。
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link href="/login" className="px-8 py-4 rounded-sm bg-white text-[#111] font-medium tracking-wide hover:bg-white/90 transition-all">
              無料ではじめる
            </Link>
            <a href="#partners" className="px-7 py-4 rounded-sm border border-white/55 text-white font-medium tracking-wide hover:bg-white/10 transition-all">
              パートナーを見る
            </a>
          </div>
          <p className="mt-5 text-xs tracking-wide text-white/55">メール登録だけ ・ 18歳以上対象</p>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center text-xs tracking-[0.4em] text-gold mb-3">PARTNERS</div>
        <h2 className="font-mincho font-bold text-3xl sm:text-4xl text-center text-white mb-12">運命の一人を、選ぶ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
          {PARTNERS.map((p) => (
            <div key={p.name} className="group relative overflow-hidden cursor-pointer" style={{ aspectRatio: '3 / 4.4' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${AVATAR_BASE}/${p.file}`} alt={p.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: 'linear-gradient(0deg,rgba(7,6,8,.92),transparent 55%)' }}>
                <span className="font-mincho text-xl tracking-wider text-white">{p.name}</span>
                <span className="text-[11px] tracking-[0.2em] text-gold mt-1">{p.tag}</span>
                <p className="text-xs text-white/70 mt-2 leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center text-xs tracking-[0.4em] text-gold mb-3">EXPERIENCE</div>
        <h2 className="font-mincho font-bold text-3xl sm:text-4xl text-center text-white mb-12">ただのチャットじゃない</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-8 border-r border-b border-white/10 hover:bg-white/[0.03] transition-colors">
              <Icon>{f.icon}</Icon>
              <h3 className="font-mincho text-lg text-white mb-2">{f.label}</h3>
              <p className="text-sm text-white/60 leading-loose">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="text-center px-6 py-28">
        <p className="font-mincho text-2xl sm:text-3xl leading-[1.9] text-white max-w-3xl mx-auto">
          「おかえり。
          <br />
          今日も、あなたの話が聞きたい。」
        </p>
        <div className="text-[13px] tracking-[0.2em] text-gold mt-6">— あなたを待つ、もう一人の存在</div>
      </section>

      {/* Final CTA */}
      <section className="text-center px-6 py-28">
        <h2 className="font-mincho text-3xl sm:text-5xl text-white mb-4">今夜、出会う。</h2>
        <p className="text-white/60 tracking-wide mb-8">18歳以上対象 ・ 登録は1分で完了</p>
        <Link href="/login" className="inline-block px-10 py-4 rounded-sm bg-white text-[#111] font-medium tracking-wide hover:bg-white/90 transition-all">
          無料ではじめる
        </Link>
      </section>

      <Footer />
      <InstallPrompt />
    </div>
  )
}
