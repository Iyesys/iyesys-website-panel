import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/permissions'
import { createFaqAction } from '../actions'
import SubmitButton from '@/components/SubmitButton'

export default async function NewFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_faqs) redirect('/admin/faqs')

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/faqs"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Sorulara Dön
      </Link>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Yeni Soru</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <form action={createFaqAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Soru</label>
            <input
              name="question"
              required
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Cevap</label>
            <textarea
              name="answer"
              required
              rows={5}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Sıra</label>
              <input
                name="sort_order"
                type="number"
                defaultValue={0}
                className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Durum</label>
              <select
                name="status"
                defaultValue="draft"
                className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınlandı</option>
              </select>
            </div>
          </div>

          <SubmitButton
            idleLabel="Kaydet"
            pendingLabel="Kaydediliyor…"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  )
}
