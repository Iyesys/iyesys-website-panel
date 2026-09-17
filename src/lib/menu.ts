import { createClient } from '@/lib/supabase/server'

export type MenuStatus = 'draft' | 'published'
export type MenuTheme = 'green' | 'blue' | 'red' | 'purple' | 'teal' | 'orange'

export type MenuCategory = {
  id: string
  slug: string
  label: string
  short_label: string
  description: string
  theme: MenuTheme
  icon: string
  sort_order: number
  status: MenuStatus
  created_at: string
  updated_at: string
}

export type MenuCategoryInput = {
  slug: string
  label: string
  short_label: string
  description: string
  theme: MenuTheme
  icon: string
  sort_order: number
  status: MenuStatus
}

export type MenuItem = {
  id: string
  category_id: string
  slug: string
  title: string
  description: string
  image_url: string | null
  sort_order: number
  status: MenuStatus
  created_at: string
  updated_at: string
}

// Slug is intentionally excluded: it's the link to a hand-coded detail
// page, so it's set once (via migration, alongside the page itself) and
// never edited from the panel - only category/order/status/copy are.
export type MenuItemInput = {
  category_id: string
  title: string
  description: string
  image_url: string | null
  sort_order: number
  status: MenuStatus
}

export async function listCategories(): Promise<MenuCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getCategoryById(id: string): Promise<MenuCategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('menu_categories').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  return data
}

export async function createCategory(input: MenuCategoryInput): Promise<MenuCategory> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('menu_categories').insert(input).select().single()

  if (error) throw error
  return data
}

export async function updateCategory(id: string, input: MenuCategoryInput): Promise<MenuCategory> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_categories')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('menu_categories').delete().eq('id', id)
  if (error) throw error
}

export async function listItems(): Promise<MenuItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function listItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getItemById(id: string): Promise<MenuItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  return data
}

export async function updateItem(id: string, input: MenuItemInput): Promise<MenuItem> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('menu_items').update(input).eq('id', id).select().single()

  if (error) throw error
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) throw error
}
