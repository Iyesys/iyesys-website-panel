'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createArticle, updateArticle, deleteArticle, getArticleById, type ArticleStatus } from '@/lib/articles'
import { getCurrentUser } from '@/lib/permissions'

function readArticleInput(formData: FormData) {
  return {
    slug: String(formData.get('slug') ?? ''),
    title: String(formData.get('title') ?? ''),
    excerpt: String(formData.get('excerpt') ?? ''),
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    content_html: String(formData.get('content_html') ?? ''),
    status: (formData.get('status') as ArticleStatus) ?? 'draft',
  }
}

export async function createArticleAction(formData: FormData) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_articles) {
    redirect(`/admin/articles/new?error=${encodeURIComponent('Yazı oluşturma yetkiniz yok')}`)
  }

  const input = readArticleInput(formData)

  if (!input.title || !input.slug) {
    redirect(`/admin/articles/new?error=${encodeURIComponent('Başlık ve slug zorunlu')}`)
  }

  if (input.status === 'published' && !currentUser.permissions.can_publish_articles) {
    redirect(`/admin/articles/new?error=${encodeURIComponent('Yayınlama yetkiniz yok')}`)
  }

  await createArticle(input)
  revalidatePath('/admin')
  redirect(`/admin?toast=${input.status === 'published' ? 'published' : 'draft-created'}`)
}

export async function updateArticleAction(id: string, formData: FormData) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_articles) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent('Yazı düzenleme yetkiniz yok')}`)
  }

  const input = readArticleInput(formData)

  if (!input.title || !input.slug) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent('Başlık ve slug zorunlu')}`)
  }

  const existing = await getArticleById(id)

  if (input.status === 'published' && existing?.status !== 'published' && !currentUser.permissions.can_publish_articles) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent('Yayınlama yetkiniz yok')}`)
  }

  await updateArticle(id, input, existing?.status === 'published')
  revalidatePath('/admin')
  redirect(`/admin?toast=${input.status === 'published' ? 'published' : 'updated'}`)
}

export async function deleteArticleAction(id: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_delete_articles) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent('Silme yetkiniz yok')}`)
  }

  await deleteArticle(id)
  revalidatePath('/admin')
  redirect('/admin?toast=deleted')
}
