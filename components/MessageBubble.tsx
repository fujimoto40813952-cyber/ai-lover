'use client'

import { Message } from '@/lib/types'

interface Props {
  message: Message
  avatarStyle: { emoji: string; gradient: string }
  onPlayAudio?: () => void
}

export default function MessageBubble({ message, avatarStyle, onPlayAudio }: Props) {
  const isUser = message.role === 'user'
  // 写真のみのときの定型キャプションは吹き出しに出さない
  const isPhotoPlaceholder = message.content === '📷 写真を送りました'
  const showText = message.content && !isPhotoPlaceholder

  return (
    <div className={`flex items-end gap-2 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar icon */}
      {!isUser && (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarStyle.gradient} flex items-center justify-center text-sm flex-shrink-0`}>
          {avatarStyle.emoji}
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* 送信した写真 */}
        {message.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.image_url}
            alt="送信した写真"
            className="max-w-[220px] max-h-[260px] rounded-2xl object-cover border border-white/15"
          />
        )}

        {showText && (
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-br-none'
              : 'bg-white/10 text-white/90 rounded-bl-none backdrop-blur-sm'
          }`}>
            {message.content}
          </div>
        )}

        {/* Audio play button */}
        {onPlayAudio && !isUser && (
          <button
            onClick={onPlayAudio}
            className="text-xs text-pink-400/70 hover:text-pink-400 transition-colors flex items-center gap-1 ml-1"
          >
            🔊 再生
          </button>
        )}
      </div>
    </div>
  )
}
