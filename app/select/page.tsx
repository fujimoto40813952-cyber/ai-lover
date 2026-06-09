import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AvatarGrid from '@/components/AvatarGrid'

export default async function SelectPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: avatars } = await supabase
    .from('avatars')
    .select('*')
    .order('created_at')

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a0a1a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.1),transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-white/40 text-sm mb-2">ステップ 1/1</p>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            パートナーを選んでください
          </h1>
          <p className="text-white/50">あなたの気持ちに寄り添う、特別な存在</p>
        </div>

        <AvatarGrid avatars={avatars || []} />
      </div>
    </main>
  )
}
