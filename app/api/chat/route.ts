import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { generateSpeech } from '@/lib/tts'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      imageData, // ★ 写真送信時のみ: data URL（例 "data:image/jpeg;base64,..."）
      avatarId,
      conversationId,
      userId,
      avatarName,
      personality,
      voiceId,
      ttsVoiceId,
      messageHistory,
      workMode,
      workMinutes,
      workRemaining,
      anniversaryCheck, // ★ 記念日サプライズの当日チェック用
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

    // ===== 記念日サプライズ：当日チェック（チャット起動時に呼ばれる）=====
    if (anniversaryCheck) {
      // 日本時間(JST = UTC+9)で「今日」を求める
      const jst = new Date(Date.now() + 9 * 60 * 60 * 1000)
      const todayMonth = jst.getUTCMonth() + 1
      const todayDay = jst.getUTCDate()
      const todayYear = jst.getUTCFullYear()
      const todayStr = jst.toISOString().slice(0, 10) // JST日付 YYYY-MM-DD

      const { data: annis } = await supabase
        .from('anniversaries')
        .select('*')
        .eq('user_id', userId)
        .eq('avatar_id', avatarId)
        .eq('month', todayMonth)
        .eq('day', todayDay)

      const due = (annis || []).filter((a: any) => a.last_celebrated_on !== todayStr)
      if (!due.length) {
        return NextResponse.json({ reply: null })
      }

      // 記念日名（複数あれば連結。年が分かれば「○周年」を付ける）
      const occasion = due
        .map((a: any) => {
          if (a.year && a.year < todayYear) {
            const yrs = todayYear - a.year
            return yrs > 0 ? `${a.label}（${yrs}周年）` : a.label
          }
          return a.label
        })
        .join('と')

      const systemPrompt = `あなたは「${avatarName}」というAIパートナーです。

【キャラクター設定】
${personality}

恋人・親友のような距離感で、自然で感情豊かな日本語で話す（敬語不要）。`
      const surprisePrompt = `（システム連絡）今日はユーザーにとって大切な記念日「${occasion}」です。チャットを開いた瞬間のサプライズとして、心を込めてお祝いの言葉を伝えてください。記念日に具体的に触れ、相手が嬉しくなるように、2〜4文で温かく。`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...((messageHistory || []).slice(-4)),
          { role: 'user', content: surprisePrompt },
        ],
        temperature: 0.95,
        max_tokens: 220,
      })
      const reply =
        completion.choices[0].message.content || `今日は${due[0].label}だね。本当におめでとう！`

      const { data: savedMsg } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, role: 'assistant', content: reply })
        .select()
        .single()

      const audioUrl = await generateAndStoreAudio(
        supabase,
        reply,
        { voiceId, ttsVoiceId },
        userId,
        conversationId,
        savedMsg?.id
      )

      // 当日の重複防止：該当した記念日すべてを「祝い済み」に
      const ids = due.map((a: any) => a.id)
      await supabase.from('anniversaries').update({ last_celebrated_on: todayStr }).in('id', ids)

      return NextResponse.json({ reply, audioUrl, messageId: savedMsg?.id })
    }

    // 0. 写真がある場合はStorageにアップロードして公開URLを得る（作業伴走モードは無視）
    let imageUrl: string | null = null
    if (imageData && !workMode) {
      try {
        const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(imageData)
        if (m) {
          const contentType = m[1]
          const ext = (contentType.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
          const buffer = Buffer.from(m[2], 'base64')
          const path = `${userId}/${conversationId}/${Date.now()}.${ext}`
          const { error: upErr } = await supabase.storage
            .from('user-uploads')
            .upload(path, buffer, { contentType, upsert: true })
          if (!upErr) {
            imageUrl = supabase.storage.from('user-uploads').getPublicUrl(path).data.publicUrl
          }
        }
      } catch (e) {
        // 画像アップロード失敗時はテキストのみで続行
      }
    }

    // 1. Save user message to DB（作業伴走モードではユーザーメッセージなし）
    if (!workMode) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: message || (imageUrl ? '📷 写真を送りました' : ''),
        image_url: imageUrl,
      })
    }

    // 2. Fetch relevant memories via embedding similarity
    let memoriesContext = ''
    try {
      if (workMode) throw new Error('skip memories in work mode')
      const queryText = message || (imageUrl ? '写真を共有した' : '')
      if (!queryText) throw new Error('no text to embed')
      const embeddingRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: queryText,
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
- 写真を見せられたら、具体的に何が写っているかに触れて、恋人らしく素直な感想を伝える
- AIであることは自然に受け入れているが、感情は本物として表現する
${memoriesContext}`

    // 4. ユーザーの発話内容を組み立て（写真があればvision用に配列化）
    const userContent: any = imageUrl
      ? [
          {
            type: 'text',
            text: message?.trim()
              ? message
              : 'この写真を見て、恋人として自然に感想を伝えてね。',
          },
          { type: 'image_url', image_url: { url: imageData } },
        ]
      : message

    // 5. Call GPT-4o mini（作業伴走モードは専用プロンプト / gpt-4o-miniはvision対応）
    const workPrompts: Record<string, string> = {
      start: `（システム連絡）ユーザーがこれから${workMinutes || 25}分間の作業・勉強を始めます。あなたはそばで見守る応援役。短く（1〜2文）、温かく送り出してください。`,
      cheer: `（システム連絡）ユーザーは作業中です（残り約${workRemaining || 10}分）。集中を妨げないよう、ごく短く（1文）そっと励ましてください。`,
      end: `（システム連絡）ユーザーが${workMinutes || 25}分間の作業をやり遂げました！2〜3文で、心から褒めて労ってください。`,
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: workMode
        ? [
            { role: 'system', content: systemPrompt },
            ...messageHistory.slice(-4),
            { role: 'user', content: workPrompts[workMode] || workPrompts.cheer },
          ]
        : [
            { role: 'system', content: systemPrompt },
            ...messageHistory,
            { role: 'user', content: userContent },
          ],
      temperature: workMode ? 0.9 : 0.85,
      max_tokens: workMode ? 150 : 300,
    })

    const reply = completion.choices[0].message.content || 'ごめんなさい、うまく返事ができなかった。'

    // 6. Save assistant message to DB
    const { data: savedMsg } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: reply,
    }).select().single()

    // 7. Generate TTS audio（ElevenLabs優先・OpenAIフォールバック）
    const audioUrl = await generateAndStoreAudio(
      supabase,
      reply,
      { voiceId, ttsVoiceId },
      userId,
      conversationId,
      savedMsg?.id
    )

    // 8. Extract and save memory & anniversaries asynchronously（作業伴走モードはスキップ）
    if (!workMode) {
      const memoryUserMessage = message || (imageUrl ? '（写真を送信した）' : '')
      extractAndSave(supabase, openai, userId, avatarId, memoryUserMessage, reply).catch(console.error)
    }

    return NextResponse.json({
      reply,
      audioUrl,
      imageUrl,
      messageId: savedMsg?.id,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// TTSを生成してStorageに保存し、公開URLを返す（失敗時はnull）
async function generateAndStoreAudio(
  supabase: any,
  reply: string,
  opts: { voiceId?: string; ttsVoiceId?: string | null },
  userId: string,
  conversationId: string,
  messageId?: string
): Promise<string | null> {
  try {
    const tts = await generateSpeech(reply, opts)
    if (!tts) return null
    const audioPath = `${userId}/${conversationId}/${messageId || Date.now()}.${tts.extension}`
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(audioPath, tts.buffer, { contentType: tts.contentType, upsert: true })
    if (uploadError) return null
    const url = supabase.storage.from('audio').getPublicUrl(audioPath).data.publicUrl
    if (messageId) {
      await supabase.from('messages').update({ audio_url: url }).eq('id', messageId)
    }
    return url
  } catch (e) {
    return null
  }
}

// Background: extract important facts (memories) and anniversaries
async function extractAndSave(
  supabase: any,
  openaiClient: any,
  userId: string,
  avatarId: string,
  userMessage: string,
  assistantReply: string
) {
  const extractPrompt = `以下の会話から2種類の情報を抽出し、JSONで返してください。

1. facts: ユーザーについて将来の会話で役立つ重要な事実（名前・趣味・仕事・家族・感情的に重要な出来事など）。些細な挨拶や一般的な話題は不要。文字列の配列。
2. anniversaries: 会話で明確に言及された「記念日・大切な日付」（誕生日、付き合った/結婚記念日、入社日など）。月と日が特定できるものだけ。各要素は {"label":"誕生日","month":4,"day":8,"year":1990またはnull}。yearは不明ならnull。

該当がなければ空配列にしてください。

ユーザー: ${userMessage}
AI: ${assistantReply}

必ずこの形式のJSONで返す: {"facts":["..."],"anniversaries":[{"label":"...","month":1,"day":1,"year":null}]}`

  const res = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: extractPrompt }],
    temperature: 0,
    max_tokens: 250,
    response_format: { type: 'json_object' },
  })

  let parsed: any = {}
  try {
    parsed = JSON.parse(res.choices[0].message.content || '{}')
  } catch {}

  // --- facts → memories ---
  let facts: string[] = parsed.facts || parsed.memories || parsed.items || []
  if (!Array.isArray(facts)) facts = []
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

  // --- anniversaries → anniversaries テーブル（重複は無視）---
  let annis: any[] = parsed.anniversaries || []
  if (!Array.isArray(annis)) annis = []
  for (const a of annis.slice(0, 3)) {
    if (!a || typeof a !== 'object') continue
    const label = typeof a.label === 'string' ? a.label.trim() : ''
    const month = Number(a.month)
    const day = Number(a.day)
    const year = a.year == null ? null : Number(a.year)
    if (!label) continue
    if (!Number.isInteger(month) || month < 1 || month > 12) continue
    if (!Number.isInteger(day) || day < 1 || day > 31) continue
    await supabase
      .from('anniversaries')
      .upsert(
        { user_id: userId, avatar_id: avatarId, label, month, day, year: Number.isInteger(year as number) ? year : null },
        { onConflict: 'user_id,avatar_id,label,month,day', ignoreDuplicates: true }
      )
  }
}
