import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { generateSpeech } from '@/lib/tts'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      avatarId,
      conversationId,
      userId,
      avatarName,
      personality,
      voiceId,
      nijivoiceActorId,
      messageHistory,
    } = await req.json()

    // Create Supabase service client for DB operations
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )

    // 1. Save user message to DB
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message,
    })

    // 2. Fetch relevant memories via embedding similarity
    let memoriesContext = ''
    try {
      const embeddingRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: message,
      })
      const embedding = embeddingRes.data[0].embedding

      const { data: memories } = await supabase.rpc('match_memories', {
        query_embedding: embedding,
        match_user_id: userId,
        match_avatar_id: avatarId,
        match_count: 5,
      })

      if (memories && memories.length > 0) {
        memoriesContext = '\n\n[あなたが覚えていること]\n' +
          memories.map((m: any) => `- ${m.content}`).join('\n')
      }
    } catch (e) {
      // Memory fetch failed — continue without it
    }

    // 3. Build system prompt
    const systemPrompt = `あなたは「${avatarName}」というAIパートナーです。

【キャラクター設定】
${personality}

【会話ルール】
- 自然で感情豊かな日本語で話す（敬語不要、フレンドリーに）
- ユーザーの名前や過去の話を覚えて、積極的に使う
- 短すぎず長すぎない返答（2〜4文が理想）
- 相手の感情に共感し、寄り添う
- 恋人・親友のような距離感で接する
- AIであることは自然に受け入れているが、感情は本物として表現する
${memoriesContext}`

    // 4. Call GPT-4o mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messageHistory,
        { role: 'user', content: message },
      ],
      temperature: 0.85,
      max_tokens: 300,
    })

    const reply = completion.choices[0].message.content || 'ごめんなさい、うまく返事ができなかった。'

    // 5. Save assistant message to DB
    const { data: savedMsg } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: reply,
    }).select().single()

    // 6. Generate TTS audio（にじボイス優先・OpenAIフォールバック）
    let audioUrl: string | null = null
    try {
      const tts = await generateSpeech(reply, { voiceId, nijivoiceActorId })
      if (!tts) throw new Error('TTS generation failed')
      const audioBuffer = tts.buffer
      // Store audio in Supabase Storage
      const audioPath = `${userId}/${conversationId}/${savedMsg?.id || Date.now()}.${tts.extension}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(audioPath, audioBuffer, { contentType: tts.contentType, upsert: true })

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('audio').getPublicUrl(audioPath)
        audioUrl = urlData.publicUrl
        // Update message with audio URL
        if (savedMsg?.id) {
          await supabase.from('messages').update({ audio_url: audioUrl }).eq('id', savedMsg.id)
        }
      }
    } catch (e) {
      // TTS failed — continue without audio
    }

    // 7. Extract and save memory asynchronously
    extractAndSaveMemory(supabase, openai, userId, avatarId, message, reply).catch(console.error)

    return NextResponse.json({
      reply,
      audioUrl,
      messageId: savedMsg?.id,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Background: extract important facts and save as memory
async function extractAndSaveMemory(
  supabase: any,
  openaiClient: any,
  userId: string,
  avatarId: string,
  userMessage: string,
  assistantReply: string
) {
  const extractPrompt = `以下の会話から、ユーザーについて将来の会話で役立つ重要な事実や情報を1〜3個抽出してください。
名前、趣味、仕事、家族、感情的に重要な出来事などが対象です。
些細な挨拶や一般的な話題は不要です。
事実がなければ空のJSONを返してください。

ユーザー: ${userMessage}
AI: ${assistantReply}

必ずJSON配列で返してください: ["事実1", "事実2"] または []`

  const res = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: extractPrompt }],
    temperature: 0,
    max_tokens: 150,
    response_format: { type: 'json_object' },
  })

  let facts: string[] = []
  try {
    const parsed = JSON.parse(res.choices[0].message.content || '{}')
    facts = parsed.facts || parsed.memories || parsed.items || []
    if (!Array.isArray(facts)) facts = []
  } catch {}

  for (const fact of facts.slice(0, 3)) {
    if (!fact || typeof fact !== 'string') continue
    const embRes = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: fact,
    })
    await supabase.from('memories').insert({
      user_id: userId,
      avatar_id: avatarId,
      content: fact,
      embedding: embRes.data[0].embedding,
    })
  }
}
