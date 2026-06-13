'use client'

interface Props {
  avatar: { name: string; image_url?: string | null }
  isPlaying: boolean
  style: { emoji: string; gradient: string }
}

export default function AvatarDisplay({ avatar, isPlaying, style }: Props) {
  return (
    <div className="relative">
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.gradient} blur-xl opacity-30 ${isPlaying ? 'animate-pulse' : ''}`} />

      {/* Avatar circle */}
      <div className={`relative w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br ${style.gradient} flex items-center justify-center avatar-glow ${isPlaying ? 'animate-pulse-soft' : 'animate-breathe'}`}>
        {avatar.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">{style.emoji}</span>
        )}
      </div>

      {/* Name */}
      <div className="text-center mt-3">
        <p className="font-semibold text-white">{avatar.name}</p>
        {isPlaying && (
          <div className="flex justify-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-pink-400 rounded-full animate-bounce"
                style={{
                  height: `${8 + Math.random() * 12}px`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
