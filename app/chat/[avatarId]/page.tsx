import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'

export default async function ChatPage({ params }: { params: { avatarId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: avatar } = await supabase
    .from('avatars')
    .select('*')
    .eq('id', params.avatarId)
    .single()

  if (!avatar) notFound()

  // Get or create conversation
  let { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .eq('avatar_id', params.avatarId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!conversation) {
    const { data: newConv } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, avatar_id: params.avatarId })
      .select()
      .single()
    conversation = newConv
  }

  // Load recent messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation!.id)
    .order('created_at', { ascending: true })
    .limit(50)

  return (
    <ChatWindow
      avatar={avatar}
      conversation={conversation!}
      initialMessages={messages || []}
      userId={user.id}
    />
  )
}
