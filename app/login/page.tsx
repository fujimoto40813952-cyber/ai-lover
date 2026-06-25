'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        })
        if (error) throw error
        // メール確認オフのときは登録と同時にセッションが発行される → そのまま選択画面へ
        if (data.session) {
          window.location.href = '/select'
        } else {
          setMessage('確認メールを送信しました。メールをご確認ください。')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/select'
      }
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/auth/callback` },
      })
      if (error) throw error
      // 成功時はGoogleの認証画面へリダイレクトされる
    } catch (err: any) {
      setMessage(err.message || 'Googleログインに失敗しました')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.1),transparent_70%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center"><Logo size={48} /></Link>
          <h1 className="text-2xl font-bold mt-3 gradient-text">AI Lover</h1>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isSignUp ? '新規登録' : 'ログイン'}
          </h2>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-[#1f1f1f] font-medium flex items-center justify-center gap-3 hover:bg-white/90 transition-all disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.62Z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
            </svg>
            Googleで続ける
          </button>

          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-xs text-white/40">または</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-1 block">メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="••••••" />
            </div>
            {message && (
              <p className={`text-sm text-center ${message.includes('送信') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? '処理中...' : isSignUp ? '登録する' : 'ログイン'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
              className="text-sm text-white/50 hover:text-pink-400 transition-colors">
              {isSignUp ? 'ログインはこちら' : '新規登録はこちら'}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-white/45">
          登録すると<a href="/terms" className="underline hover:text-white/70">利用規約</a>・<a href="/privacy" className="underline hover:text-white/70">プライバシーポリシー</a>に同意したものとみなされます。本サービスは18歳以上対象です。
        </p>
      </div>
    </main>
  )
}
