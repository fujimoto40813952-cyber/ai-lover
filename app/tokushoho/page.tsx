import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 - AI Lover',
  robots: { index: true, follow: true },
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3 border-b border-white/10">
      <div className="text-white/60 text-sm">{label}</div>
      <div className="sm:col-span-2 text-white/90">{children}</div>
    </div>
  )
}

export default function TokushohoPage() {
  return (
    <LegalShell title="特定商取引法に基づく表記" updatedAt="2026年6月17日">
      <p className="text-sm text-white/60">
        本表記は、有料サービスの提供に際し特定商取引法に基づき表示するものです。【要記入】の項目は公開前に必ずご記入ください。
      </p>
      <div className="mt-4">
        <Row label="販売事業者">AI Lover 事務局</Row>
        <Row label="運営統括責任者">藤本 直樹</Row>
        <Row label="所在地">東京都八王子市（詳細な住所はご請求があった場合に遅滞なく開示します）</Row>
        <Row label="電話番号">ご請求があった場合に遅滞なく開示します</Row>
        <Row label="お問い合わせ">LINE公式アカウント（@383lgjsi）にて受付。ドメイン取得後にメール窓口も開設予定。</Row>
        <Row label="販売価格">各有料サービスの申込画面に表示する価格（消費税込）。</Row>
        <Row label="商品代金以外の必要料金">インターネット接続に必要な通信料等はお客様のご負担となります。</Row>
        <Row label="支払方法">クレジットカード決済（Stripe）等、申込画面に表示する方法。</Row>
        <Row label="支払時期">お申込み時、または各プランに定める課金日。</Row>
        <Row label="サービスの提供時期">決済完了後、ただちに利用可能となります。</Row>
        <Row label="返品・キャンセル">
          サービスの性質上、提供開始後の返金・キャンセルは原則お受けできません。サブスクリプションは次回更新日の前までに解約することで、次回以降の課金を停止できます。
        </Row>
        <Row label="動作環境">最新版の主要ブラウザ（Chrome / Safari / Edge 等）。</Row>
      </div>
    </LegalShell>
  )
}
