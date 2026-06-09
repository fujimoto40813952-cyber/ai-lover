'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        })
        if (error) throw error
        setMessage('確認メールを送信しました。メールをご確認ください。')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/select')
        router.refresh()
      }
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.1),transparent_70%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><span className="text-4xl">💝</span></Link>
          <h1 className="text-2xl font-bold mt-3 gradient-text">AI Lover</h1>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isSignUp ? '新規登録' : 'ログイン'}
          </h2>
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
      </div>
    </main>
  )
}
