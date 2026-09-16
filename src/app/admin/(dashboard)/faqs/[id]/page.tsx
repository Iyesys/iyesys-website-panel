import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getFaqById } from '@/lib/faqs'
import { getCurrentUser } from '@/lib/permissions'
import { updateFaqAction, deleteFaqAction } from '../actions'
import DeleteFaqButton from '@/components/DeleteFaqButton'
import SubmitButton from '@/components/SubmitButton'

export default async function EditFaqPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const currentUser = await getCurrentUser()
  const faq = await getFaqById(id)

  if (!faq) notFound()

  const updateWithId = updateFaqAction.bind(null, id)
  const deleteWithId = deleteFaqAction.bind(null, id)
  const canManage = currentUser?.permissions.can_manage_faqs ?? false

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/faqs"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Sorulara Dön
        </Link>

        {canManage && <DeleteFaqButton action={deleteWithId} />}
      </div>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Soruyu Düzenle</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        {canManage ? (
          <form action={updateWithId} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Soru</label>
              <input
                name="question"
                required
                defaultValue={faq.question}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Cevap</label>
              <textarea
                name="answer"
                required
                rows={5}
                defaultValue={faq.answer}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Sıra</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={faq.sort_order}
                  className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Durum</label>
                <select
                  name="status"
                  defaultValue={faq.status}
                  className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayınlandı</option>
                </select>
              </div>
            </div>

            <SubmitButton idleLabel="Kaydet" pendingLabel="Kaydediliyor…" />
          </form>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-medium text-slate-900">Soru</p>
              <p className="mt-1">{faq.question}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Cevap</p>
              <p className="mt-1 whitespace-pre-line">{faq.answer}</p>
            </div>
            <p className="text-xs text-slate-400">Düzenlemek için SSS yönetimi yetkisi gerekir.</p>
          </div>
        )}
      </div>
    </div>
  )
}
