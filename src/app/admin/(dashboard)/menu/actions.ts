'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  updateItem,
  deleteItem,
  type MenuStatus,
  type MenuTheme,
} from '@/lib/menu'
import { getCurrentUser } from '@/lib/permissions'

function readCategoryInput(formData: FormData) {
  return {
    slug: String(formData.get('slug') ?? '').trim(),
    label: String(formData.get('label') ?? '').trim(),
    short_label: String(formData.get('short_label') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    theme: (formData.get('theme') as MenuTheme) ?? 'blue',
    icon: String(formData.get('icon') ?? '').trim() || 'shapes',
    sort_order: Number(formData.get('sort_order') ?? 0) || 0,
    status: (formData.get('status') as MenuStatus) ?? 'draft',
  }
}

// No slug here - it's the link to a hand-coded detail page and is never
// edited from the panel, see the MenuItemInput comment in lib/menu.ts.
function readItemInput(formData: FormData) {
  return {
    category_id: String(formData.get('category_id') ?? ''),
    title: String(formData.get('title') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    image_url: (formData.get('image_url') as string) || null,
    sort_order: Number(formData.get('sort_order') ?? 0) || 0,
    status: (formData.get('status') as MenuStatus) ?? 'draft',
  }
}

async function requireMenuManager(redirectPath: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_menu) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Bu işlem için yetkiniz yok')}`)
  }
}

export async function createCategoryAction(formData: FormData) {
  await requireMenuManager('/admin/menu/categories/new')

  const input = readCategoryInput(formData)
  if (!input.slug || !input.label || !input.short_label) {
    redirect(`/admin/menu/categories/new?error=${encodeURIComponent('Slug, başlık ve kısa başlık zorunlu')}`)
  }

  await createCategory(input)
  revalidatePath('/admin/menu')
  redirect('/admin/menu?toast=category-created')
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireMenuManager(`/admin/menu/categories/${id}`)

  const input = readCategoryInput(formData)
  if (!input.slug || !input.label || !input.short_label) {
    redirect(`/admin/menu/categories/${id}?error=${encodeURIComponent('Slug, başlık ve kısa başlık zorunlu')}`)
  }

  await updateCategory(id, input)
  revalidatePath('/admin/menu')
  redirect('/admin/menu?toast=category-updated')
}

export async function deleteCategoryAction(id: string) {
  await requireMenuManager(`/admin/menu/categories/${id}`)

  await deleteCategory(id)
  revalidatePath('/admin/menu')
  redirect('/admin/menu?toast=category-deleted')
}

export async function updateItemAction(id: string, formData: FormData) {
  await requireMenuManager(`/admin/menu/items/${id}`)

  const input = readItemInput(formData)
  if (!input.title || !input.category_id) {
    redirect(`/admin/menu/items/${id}?error=${encodeURIComponent('Başlık ve kategori zorunlu')}`)
  }

  await updateItem(id, input)
  revalidatePath('/admin/menu')
  redirect('/admin/menu?toast=item-updated')
}

export async function deleteItemAction(id: string) {
  await requireMenuManager(`/admin/menu/items/${id}`)

  await deleteItem(id)
  revalidatePath('/admin/menu')
  redirect('/admin/menu?toast=item-deleted')
}
