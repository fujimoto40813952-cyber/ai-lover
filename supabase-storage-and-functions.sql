-- Run this in Supabase SQL Editor after the initial schema

-- 1. Create audio storage bucket
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict do nothing;

-- 2. Allow anyone to read audio files (public bucket)
create policy "Public audio access" on storage.objects
  for select using (bucket_id = 'audio');

-- 3. Allow authenticated users to upload audio
create policy "Authenticated users can upload audio" on storage.objects
  for insert with check (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- 4. pgvector memory similarity search function
create or replace function match_memories(
  query_embedding vector(1536),
  match_user_id uuid,
  match_avatar_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from memories
  where user_id = match_user_id
    and avatar_id = match_avatar_id
    and embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;
