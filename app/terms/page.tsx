import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'

export const metadata: Metadata = {
  title: '利用規約 - AI Lover',
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <LegalShell title="利用規約" updatedAt="2026年6月17日">
      <p>
        本利用規約（以下「本規約」）は、AI Lover 事務局（以下「当社」）が提供するAIコンパニオンサービス「AI Lover」（以下「本サービス」）の利用条件を定めるものです。利用者（以下「ユーザー」）は、本サービスを利用することで本規約に同意したものとみなされます。
      </p>

      <h2 className="text-xl font-semibold text-white">第1条（適用）</h2>
      <p>本規約は、本サービスの提供条件およびユーザーと当社との間の権利義務関係に適用されます。</p>

      <h2 className="text-xl font-semibold text-white">第2条（年齢制限）</h2>
      <p>本サービスは18歳以上の方のみご利用いただけます。18歳未満の方は登録・利用できません。ユーザーは登録にあたり18歳以上であることを表明・保証するものとします。</p>

      <h2 className="text-xl font-semibold text-white">第3条（利用登録）</h2>
      <p>ユーザーはメールアドレス等の必要事項を登録し、当社が承認することで利用登録が完了します。登録情報は正確かつ最新の内容を維持してください。</p>

      <h2 className="text-xl font-semibold text-white">第4条（アカウント管理）</h2>
      <p>ユーザーは自己の責任でアカウント情報（メールアドレス・パスワード等）を管理するものとし、第三者に利用させ、または貸与・譲渡してはなりません。</p>

      <h2 className="text-xl font-semibold text-white">第5条（料金・有料オプション）</h2>
      <p>本サービスは基本機能を無料で提供します。記念日演出・キャラクターのカスタマイズ等の一部機能は有料オプション（以下「有料サービス」）として提供される場合があります。有料サービスの内容・料金・支払方法は、申込画面または別途定める案内に表示します。</p>

      <h2 className="text-xl font-semibold text-white">第6条（AIの性質・免責）</h2>
      <p>本サービスのキャラクターおよび応答はAIにより自動生成される創作物であり、実在の人物・感情・人格ではありません。応答内容の正確性・有用性・特定目的への適合性を保証しません。本サービスは医療・法律・金融・心理その他の専門的助言を提供するものではなく、これらが必要な場合は資格を有する専門家にご相談ください。</p>

      <h2 className="text-xl font-semibold text-white">第7条（禁止事項）</h2>
      <p>
        ユーザーは、法令・公序良俗に違反する行為、犯罪行為に関連する行為、他者の権利を侵害する行為、当社や第三者への誹謗中傷・嫌がらせ、児童に対する性的搾取・虐待を想起させる内容の入力、本サービスの運営を妨害する行為、不正アクセス、リバースエンジニアリング、その他当社が不適切と判断する行為を行ってはなりません。
      </p>

      <h2 className="text-xl font-semibold text-white">第8条（ユーザーコンテンツ）</h2>
      <p>ユーザーが入力したテキスト・画像等のコンテンツの権利はユーザーに帰属します。ただし当社は、本サービスの提供・改善・不具合対応に必要な範囲でこれを利用できるものとします。</p>

      <h2 className="text-xl font-semibold text-white">第9条（サービスの変更・中断・終了）</h2>
      <p>当社は、ユーザーへの事前告知なく本サービスの内容を変更し、または提供を中断・終了できるものとします。これによりユーザーに生じた損害について、当社は責任を負いません。</p>

      <h2 className="text-xl font-semibold text-white">第10条（免責）</h2>
      <p>当社は、本サービスに事実上または法律上の瑕疵がないことを保証しません。当社の故意または重過失による場合を除き、本サービスに関連してユーザーに生じた損害について責任を負いません。</p>

      <h2 className="text-xl font-semibold text-white">第11条（準拠法・管轄）</h2>
      <p>本規約は日本法に準拠します。本サービスに関して紛争が生じた場合、東京地方裁判所立川支部を第一審の専属的合意管轄裁判所とします。</p>

      <h2 className="text-xl font-semibold text-white">第12条（お問い合わせ）</h2>
      <p>本規約に関するお問い合わせは、LINE公式アカウント（【要記入：LINE URL】）にて受け付けています。</p>
    </LegalShell>
  )
}
