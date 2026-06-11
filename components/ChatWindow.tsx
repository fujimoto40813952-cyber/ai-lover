'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar, Message, Conversation } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AvatarDisplay from './AvatarDisplay'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

const AVATAR_PLACEHOLDERS: Record<string, { emoji: string; gradient: string }> = {
  'Hana': { emoji: '🌸', gradient: 'from-pink-400 to-rose-500' },
  'Yuki': { emoji: '❄️', gradient: 'from-blue-400 to-purple-500' },
  'Ren': { emoji: '🌙', gradient: 'from-indigo-500 to-purple-600' },
  'Kai': { emoji: '⚡', gradient: 'from-amber-400 to-orange-500' },
}

interface Props {
  avatar: Avatar
  conversation: Conversation
  initialMessages: Message[]
  userId: string
}

export default function ChatWindow({ avatar, conversation, initialMessages, userId }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [workSession, setWorkSession] = useState<{ minutes: number; endsAt: number } | null>(null)
  const [workRemaining, setWorkRemaining] = useState(0)
  const [showWorkMenu, setShowWorkMenu] = useState(false)
  const workTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextCheerRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const style = AVATAR_PLACEHOLDERS[avatar.name] ?? { emoji: '💫', gradient: 'from-pink-500 to-purple-600' }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message to UI immediately
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversation.id,
      role: 'user',
      content,
      audio_url: null,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          avatarId: avatar.id,
          conversationId: conversation.id,
          userId,
          avatarName: avatar.name,
          personality: avatar.personality,
          voiceId: avatar.voice_id,
          ttsVoiceId: avatar.tts_voice_id || null,
          messageHistory: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      // Add assistant message
      const assistantMsg: Message = {
        id: data.messageId || `temp-assistant-${Date.now()}`,
        conversation_id: conversation.id,
        role: 'assistant',
        content: data.reply,
        audio_url: data.audioUrl || null,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])

      // Auto-play audio if available
      if (data.audioUrl) {
        playAudio(data.audioUrl)
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        conversation_id: conversation.id,
        role: 'assistant',
        content: 'ごめんなさい、少し調子が悪いみたい。もう一度話しかけてくれる？',
        audio_url: null,
        created_at: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const requestWorkMessage = async (mode: 'start' | 'cheer' | 'end', minutes: number, remaining: number) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '',
          workMode: mode,
          workMinutes: minutes,
          workRemaining: remaining,
          avatarId: avatar.id,
          conversationId: conversation.id,
          userId,
          avatarName: avatar.name,
          personality: avatar.personality,
          voiceId: avatar.voice_id,
          ttsVoiceId: avatar.tts_voice_id || null,
          messageHistory: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (!response.ok) return
      const data = await response.json()
      setMessages(prev => [...prev, {
        id: data.messageId || `work-${mode}-${Date.now()}`,
        conversation_id: conversation.id,
        role: 'assistant',
        content: data.reply,
        audio_url: data.audioUrl || null,
        created_at: new Date().toISOString(),
      }])
      if (data.audioUrl) playAudio(data.audioUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const startWork = (minutes: number) => {
    if (workSession) return
    const endsAt = Date.now() + minutes * 60_000
    setWorkSession({ minutes, endsAt })
    setWorkRemaining(minutes * 60)
    setShowWorkMenu(false)
    nextCheerRef.current = Date.now() + 10 * 60_000 // 10分ごとに応援
    requestWorkMessage('start', minutes, minutes)
    workTimerRef.current = setInterval(() => {
      const remainMs = endsAt - Date.now()
      if (remainMs <= 0) {
        if (workTimerRef.current) clearInterval(workTimerRef.current)
        workTimerRef.current = null
        setWorkSession(null)
        setWorkRemaining(0)
        requestWorkMessage('end', minutes, 0)
        return
      }
      setWorkRemaining(Math.ceil(remainMs / 1000))
      // 残り2分未満では途中応援しない
      if (Date.now() >= nextCheerRef.current && remainMs > 2 * 60_000) {
        nextCheerRef.current = Date.now() + 10 * 60_000
        requestWorkMessage('cheer', minutes, Math.ceil(remainMs / 60_000))
      }
    }, 1000)
  }

  const cancelWork = () => {
    if (workTimerRef.current) clearInterval(workTimerRef.current)
    workTimerRef.current = null
    setWorkSession(null)
    setWorkRemaining(0)
  }

  useEffect(() => {
    return () => {
      if (workTimerRef.current) clearInterval(workTimerRef.current)
    }
  }, [])

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(console.error)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 backdrop-blur-sm bg-black/20">
        <button onClick={() => router.push('/select')} className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← 戻る
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">{style.emoji}</span>
          <span className="font-semibold text-white">{avatar.name}</span>
          {isPlaying && <span className="text-xs text-pink-400 animate-pulse">♪ 話し中</span>}
        </div>
        <div className="flex items-center gap-3">
          {workSession ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/30">
              <span className="text-xs text-pink-300">🍅 {formatTime(workRemaining)}</span>
              <button onClick={cancelWork} className="text-white/40 hover:text-white/80 text-xs">✕</button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWorkMenu(v => !v)}
                className="px-3 py-1 rounded-full text-xs text-pink-300 bg-pink-500/10 border border-pink-400/20 hover:bg-pink-500/20 transition-colors"
              >
                🍅 一緒に作業
              </button>
              {showWorkMenu && (
                <div className="absolute right-0 top-9 z-20 bg-[#1a0a2e] border border-white/10 rounded-xl shadow-xl p-2 w-44">
                  <p className="text-[10px] text-white/40 px-2 pb-1">作業時間を選んでね</p>
                  {[25, 50].map(m => (
                    <button
                      key={m}
                      onClick={() => startWork(m)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      {m}分 集中する
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button onClick={handleSignOut} className="text-white/30 hover:text-white/70 text-xs transition-colors">
            ログアウト
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Avatar panel (hidden on mobile, visible on md+) */}
        <aside className="hidden md:flex w-64 flex-col items-center justify-center p-6 border-r border-white/5">
          <AvatarDisplay avatar={avatar} isPlaying={isPlaying} style={style} />
          <p className="text-xs text-white/30 mt-4 text-center leading-relaxed">{avatar.description}</p>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center pt-12">
                <div className="text-4xl mb-3">{style.emoji}</div>
                <p className="text-white/60 text-sm">
                  {avatar.name}があなたを待っています
                </p>
                <p className="text-white/30 text-xs mt-1">
                  最初のメッセージを送ってみましょう
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} avatarStyle={style} onPlayAudio={msg.audio_url ? () => playAudio(msg.audio_url!) : undefined} />
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center text-sm flex-shrink-0`}>
                  {style.emoji}
                </div>
                <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}
