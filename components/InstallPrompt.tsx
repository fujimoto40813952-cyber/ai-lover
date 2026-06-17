'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * PWAインストール導線。
 * - Android/Chrome系: beforeinstallprompt を捕まえて「ホーム画面に追加」ボタンを表示
 * - iOS Safari: 共有メニューからの追加手順を案内（beforeinstallprompt非対応のため）
 * すでにスタンドアロン起動中、または当セッションで閉じた場合は出さない。
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // すでにインストール済み（スタンドアロン）なら何もしない
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    if (standalone) return

    const ua = window.navigator.userAgent
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    // iOS は beforeinstallprompt が来ないので手動で案内
    if (ios) {
      setIsIOS(true)
      setShow(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  if (!show) return null

  const handleInstall = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3 shadow-lg shadow-black/30 flex items-center gap-3">
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-white/90">アプリとして使う</p>
          {isIOS ? (
            <p className="text-xs text-white/65 mt-0.5">
              共有メニュー <span aria-hidden>⬆️</span> →「ホーム画面に追加」でアプリ化できます
            </p>
          ) : (
            <p className="text-xs text-white/65 mt-0.5">ホーム画面に追加してすぐ起動</p>
          )}
        </div>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            追加
          </button>
        )}
        <button
          onClick={() => setShow(false)}
          aria-label="閉じる"
          className="shrink-0 w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
