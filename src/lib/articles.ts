import { createClient } from '@/lib/supabase/server'

export type ArticleStatus = 'draft' | 'published'

export type Article = {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_image_url: string | null
  content_html: string
  status: ArticleStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type ArticleInput = {
  slug: string
  title: string
  excerpt: string
  cover_image_url: string | null
  content_html: string
  status: ArticleStatus
}

export async function listArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  return data
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...input,
      published_at: input.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateArticle(id: string, input: ArticleInput, wasPublished: boolean): Promise<Article> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .update({
      ...input,
      published_at:
        input.status === 'published' && !wasPublished ? new Date().toISOString() : undefined,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}
