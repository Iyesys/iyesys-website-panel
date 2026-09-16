import { createClient } from '@/lib/supabase/server'

export type FaqStatus = 'draft' | 'published'

export type Faq = {
  id: string
  question: string
  answer: string
  sort_order: number
  status: FaqStatus
  created_at: string
  updated_at: string
}

export type FaqInput = {
  question: string
  answer: string
  sort_order: number
  status: FaqStatus
}

export async function listFaqs(): Promise<Faq[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getFaqById(id: string): Promise<Faq | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  return data
}

export async function createFaq(input: FaqInput): Promise<Faq> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faqs').insert(input).select().single()

  if (error) throw error
  return data
}

export async function updateFaq(id: string, input: FaqInput): Promise<Faq> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faqs').update(input).eq('id', id).select().single()

  if (error) throw error
  return data
}

export async function deleteFaq(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw error
}
