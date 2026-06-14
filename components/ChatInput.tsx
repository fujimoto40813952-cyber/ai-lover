'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface Props {
  onSend: (message: string, imageData?: string) => void
  disabled?: boolean
}

// 画像をcanvasで縮小してJPEG dataURLに変換（送信ペイロードを軽量化）
async function fileToScaledDataUrl(file: File, maxSize = 1024, quality = 0.8): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })
  let { width, height } = img
  if (width > maxSize || height > maxSize) {
    if (width >= height) {
      height = Math.round((height * maxSize) / width)
      width = maxSize
    } else {
      width = Math.round((width * maxSize) / height)
      height = maxSize
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return dataUrl
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const [imageData, setImageData] = useState<string | null>(null)
  const [imgLoading, setImgLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if ((!trimmed && !imageData) || disabled) return
    onSend(trimmed, imageData || undefined)
    setValue('')
    setImageData(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setImgLoading(true)
    try {
      const scaled = await fileToScaledDataUrl(file)
      setImageData(scaled)
    } catch (err) {
      console.error(err)
    } finally {
      setImgLoading(false)
    }
  }

  return (
    <div className="border-t border-white/10 p-4 bg-black/20 backdrop-blur-sm" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      {/* 画像プレビュー */}
      {(imageData || imgLoading) && (
        <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2">
          {imgLoading ? (
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white/40 text-xs">
              読込中…
            </div>
          ) : (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageData!} alt="送信する写真" className="w-16 h-16 rounded-xl object-cover border border-white/20" />
              <button
                onClick={() => { setImageData(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black/70 text-white/80 text-xs flex items-center justify-center hover:bg-black"
                aria-label="写真を取り消す"
              >
                ✕
              </button>
            </div>
          )}
          <span className="text-xs text-white/40">写真を添付しました</span>
        </div>
      )}

      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        {/* 写真選択ボタン */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors disabled:opacity-30 flex-shrink-0"
          aria-label="写真を送る"
          title="写真を送る"
        >
          📷
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={disabled}
            placeholder="メッセージを入力... (Enter で送信)"
            rows={1}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-pink-400/60 transition-colors resize-none text-base leading-relaxed disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={(!value.trim() && !imageData) || disabled}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 hover:scale-105"
        >
          {disabled ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-white/20 mt-2">Shift+Enterで改行 ・ 📷で写真を送れます</p>
    </div>
  )
}
