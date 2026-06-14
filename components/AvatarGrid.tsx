'use client'

import { useRouter } from 'next/navigation'
import { Avatar } from '@/lib/types'

const AVATAR_PLACEHOLDERS: Record<string, { emoji: string; gradient: string }> = {
  'Hana': { emoji: '🌸', gradient: 'from-pink-400 to-rose-500' },
  'Yuki': { emoji: '❄️', gradient: 'from-blue-400 to-purple-500' },
  'Ren': { emoji: '🌙', gradient: 'from-indigo-500 to-purple-600' },
  'Kai': { emoji: '⚡', gradient: 'from-amber-400 to-orange-500' },
}

export default function AvatarGrid({ avatars }: { avatars: Avatar[] }) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {avatars.map((avatar) => {
        const style = AVATAR_PLACEHOLDERS[avatar.name] ?? { emoji: '💫', gradient: 'from-pink-500 to-purple-600' }
        return (
          <button
            key={avatar.id}
            onClick={() => router.push(`/chat/${avatar.id}`)}
            className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-pink-500/20"
          >
            {/* Avatar visual */}
            <div className={`aspect-square bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}>
              {avatar.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl animate-breathe">{style.emoji}</span>
              )}
            </div>

            {/* Info */}
            <div className="p-4 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">{avatar.name}</h3>
                <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                  {avatar.gender === 'female' ? '♀' : '♂'}
                </span>
              </div>
              <p className="text-xs text-white/50 line-clamp-2">{avatar.description}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-pink-300 group-hover:text-pink-200">話す →</span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        )
      })}
    </div>
  )
}
