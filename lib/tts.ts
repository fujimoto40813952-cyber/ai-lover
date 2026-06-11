import { openai } from '@/lib/openai'

export interface TTSResult {
  buffer: Buffer
  contentType: string
  extension: string
}

export interface VoiceConfig {
  voiceId: string // OpenAI voice (fallback): nova / shimmer / onyx / echo ...
  ttsVoiceId?: string | null // ElevenLabs の voice ID（設定時はこちらを優先）
}

/**
 * ElevenLabs で音声生成。キー未設定・エラー時は null を返す（呼び出し側でフォールバック）。
 * docs: https://elevenlabs.io/docs/api-reference/text-to-speech/convert
 */
async function generateWithElevenLabs(text: string, voiceId: string): Promise<TTSResult | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2', // 日本語対応・感情表現が豊か
          voice_settings: {
            stability: 0.4,        // 低め＝感情の起伏が出やすい
            similarity_boost: 0.8,
            style: 0.4,
            use_speaker_boost: true,
          },
        }),
      }
    )
    if (!res.ok) {
      console.error('ElevenLabs API error:', res.status, await res.text())
      return null
    }
    return {
      buffer: Buffer.from(await res.arrayBuffer()),
      contentType: 'audio/mpeg',
      extension: 'mp3',
    }
  } catch (e) {
    console.error('ElevenLabs TTS failed:', e)
    return null
  }
}

/** OpenAI TTS（フォールバック） */
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
 * 1) ttsVoiceId があり ELEVENLABS_API_KEY 設定済み → ElevenLabs
 * 2) それ以外 / 失敗時 → OpenAI tts-1-hd にフォールバック
 */
export async function generateSpeech(
  text: string,
  { voiceId, ttsVoiceId }: VoiceConfig
): Promise<TTSResult | null> {
  if (ttsVoiceId) {
    const el = await generateWithElevenLabs(text, ttsVoiceId)
    if (el) return el
  }
  return generateWithOpenAI(text, voiceId)
}
