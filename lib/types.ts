export interface Avatar {
  id: string
  name: string
  gender: 'male' | 'female'
  personality: string
  description: string
  image_url: string | null
  voice_id: string
  nijivoice_actor_id: string | null
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  audio_url: string | null
  created_at: string
}

export interface Memory {
  id: string
  user_id: string
  avatar_id: string
  content: string
  memory_type: string
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  avatar_id: string
  title: string | null
  created_at: string
  updated_at: string
}
