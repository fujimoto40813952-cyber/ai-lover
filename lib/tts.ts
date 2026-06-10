import { openai } from '@/lib/openai'

export interface TTSResult {
  buffer: Buffer
  contentType: string
  extension: string
}

export interface VoiceConfig {
  voiceId: string // OpenAI voice (fallback): nova / shimmer / onyx / echo ...
  nijivoiceActorId?: string | null // にじボイスの voice actor ID（設定時はこちらを優先）
}

const NIJIVOICE_API_BASE = 'https://api.nijivoice.com/api/platform/v1'

/**
 * にじボイスで音声生成。キー未設定・エラー時は null を返す（呼び出し側でフォールバック）。
 * docs: https://docs.nijivoice.com/
 */
async function generateWithNijivoice(text: string, actorId: string): Promise<TTSResult | null> {
  const apiKey = process.env.NIJIVOICE_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(
      `${NIJIVOICE_API_BASE}/voice-actors/${actorId}/generate-voice`,
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        // script は最大3,000文字。返信は2〜4文なので余裕あり。
        body: JSON.stringify({ script: text, speed: '1.0', format: 'mp3' }),
      }
    )
    if (!res.ok) {
      console.error('Nijivoice API error:', res.status, await res.text())
      return null
    }
    const data = await res.json()
    const audioUrl: string | undefined =
      data?.generatedVoice?.audioFileDownloadUrl || data?.generatedVoice?.audioFileUrl
    if (!audioUrl) return null
    const audioRes = await fetch(audioUrl)
    if (!audioRes.ok) return null
    return {
      buffer: Buffer.from(await audioRes.arrayBuffer()),
      contentType: 'audio/mpeg',
      extension: 'mp3',
    }
  } catch (e) {
    console.error('Nijivoice TTS failed:', e)
    return null
  }
}

/** OpenAI TTS（フォールバック）。tts-1 → tts-1-hd に品質アップ。 */
async function generateWithOpenAI(text: string, voiceId: string): Promise<TTSResult | null> {
  try {
    const ttsRes = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: (voiceId || 'nova') as any,
      input: text,
      speed: 1.0,
    })
    return {
      buffer: Buffer.from(await ttsRes.arrayBuffer()),
      contentType: 'audio/mpeg',
      extension: 'mp3',
    }
  } catch (e) {
    console.error('OpenAI TTS failed:', e)
    return null
  }
}

/**
 * 音声生成のエントリポイント。
 * 1) nijivoiceActorId があり NIJIVOICE_API_KEY 設定済み → にじボイス
 * 2) それ以外 / 失敗時 → OpenAI tts-1-hd にフォールバック
 */
export async function generateSpeech(
  text: string,
  { voiceId, nijivoiceActorId }: VoiceConfig
): Promise<TTSResult | null> {
  if (nijivoiceActorId) {
    const niji = await generateWithNijivoice(text, nijivoiceActorId)
    if (niji) return niji
  }
  return generateWithOpenAI(text, voiceId)
}
