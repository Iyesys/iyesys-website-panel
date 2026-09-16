'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createFaq, updateFaq, deleteFaq, type FaqStatus } from '@/lib/faqs'
import { getCurrentUser } from '@/lib/permissions'

function readFaqInput(formData: FormData) {
  return {
    question: String(formData.get('question') ?? '').trim(),
    answer: String(formData.get('answer') ?? '').trim(),
    sort_order: Number(formData.get('sort_order') ?? 0) || 0,
    status: (formData.get('status') as FaqStatus) ?? 'draft',
  }
}

async function requireFaqManager(redirectPath: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_faqs) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Bu işlem için yetkiniz yok')}`)
  }
}

export async function createFaqAction(formData: FormData) {
  await requireFaqManager('/admin/faqs/new')

  const input = readFaqInput(formData)
  if (!input.question || !input.answer) {
    redirect(`/admin/faqs/new?error=${encodeURIComponent('Soru ve cevap zorunlu')}`)
  }

  await createFaq(input)
  revalidatePath('/admin/faqs')
  redirect('/admin/faqs?toast=faq-created')
}

export async function updateFaqAction(id: string, formData: FormData) {
  await requireFaqManager(`/admin/faqs/${id}`)

  const input = readFaqInput(formData)
  if (!input.question || !input.answer) {
    redirect(`/admin/faqs/${id}?error=${encodeURIComponent('Soru ve cevap zorunlu')}`)
  }

  await updateFaq(id, input)
  revalidatePath('/admin/faqs')
  redirect('/admin/faqs?toast=faq-updated')
}

export async function deleteFaqAction(id: string) {
  await requireFaqManager(`/admin/faqs/${id}`)

  await deleteFaq(id)
  revalidatePath('/admin/faqs')
  redirect('/admin/faqs?toast=faq-deleted')
}
