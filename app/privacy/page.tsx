import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'プライバシーポリシー - AI Lover',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <LegalShell title="プライバシーポリシー" updatedAt="2026年6月17日">
      <p>
        AI Lover 事務局（以下「当社」）は、AIコンパニオンサービス「AI Lover」（以下「本サービス」）における利用者（以下「ユーザー」）の個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
      </p>

      <h2 className="text-xl font-semibold text-white">1. 取得する情報</h2>
      <p>
        当社は、本サービスの提供にあたり次の情報を取得します。<br />
        ・アカウント情報：メールアドレス、認証情報<br />
        ・利用コンテンツ：ユーザーがチャットに入力したテキスト、送信した画像、AIが記憶として保存する情報、記念日等の登録情報<br />
        ・利用ログ：アクセス日時、利用状況、端末・ブラウザ情報、Cookie等
      </p>

      <h2 className="text-xl font-semibold text-white">2. 利用目的</h2>
      <p>
        取得した情報は、本サービスの提供・本人認証・会話の継続性（記憶機能）の実現・機能改善・不具合対応・不正利用の防止・お問い合わせ対応の目的で利用します。
      </p>

      <h2 className="text-xl font-semibold text-white">3. 外部サービスへの提供（処理の委託）</h2>
      <p>
        本サービスは、機能提供のため以下の外部サービスを利用しており、必要な範囲でデータを送信・保管します。各社のプライバシーポリシーが適用されます。<br />
        ・OpenAI（応答生成・音声合成・テキスト解析）<br />
        ・ElevenLabs（音声合成）<br />
        ・Supabase（データベース・認証・ストレージ）<br />
        ・Vercel（アプリケーションのホスティング）<br />
        これらの一部は日本国外のサーバーで処理される場合があります（外国にある第三者への提供を含みます）。
      </p>

      <h2 className="text-xl font-semibold text-white">4. 第三者提供</h2>
      <p>当社は、法令に基づく場合等を除き、あらかじめユーザーの同意を得ずに個人情報を第三者に提供しません。</p>

      <h2 className="text-xl font-semibold text-white">5. Cookie等の利用</h2>
      <p>本サービスはログイン状態の維持等のためCookie等を使用します。ブラウザ設定により無効化できますが、その場合一部機能が利用できないことがあります。</p>

      <h2 className="text-xl font-semibold text-white">6. 保存期間</h2>
      <p>取得した情報は、利用目的の達成に必要な期間、またはアカウント削除まで保管し、不要となった場合は適切に削除します。</p>

      <h2 className="text-xl font-semibold text-white">7. 開示・訂正・削除の請求</h2>
      <p>ユーザーは、自己の個人情報の開示・訂正・利用停止・削除を請求できます。ご希望の場合は下記お問い合わせ先までご連絡ください。本人確認のうえ、法令に従い対応します。</p>

      <h2 className="text-xl font-semibold text-white">8. 安全管理</h2>
      <p>当社は、個人情報の漏えい・滅失・毀損の防止その他の安全管理のために必要かつ適切な措置を講じます。</p>

      <h2 className="text-xl font-semibold text-white">9. 改定</h2>
      <p>本ポリシーは、必要に応じて改定されることがあります。重要な変更がある場合は本サービス上で告知します。</p>

      <h2 className="text-xl font-semibold text-white">10. お問い合わせ窓口</h2>
      <p>個人情報の取扱いに関するお問い合わせは、LINE公式アカウント（【要記入：LINE URL】）にて受け付けています。</p>
    </LegalShell>
  )
}
