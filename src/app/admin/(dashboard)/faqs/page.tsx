import Link from 'next/link'
import { Plus, HelpCircle } from 'lucide-react'
import { listFaqs } from '@/lib/faqs'
import { getCurrentUser } from '@/lib/permissions'
import ToastOnMount from '@/components/ToastOnMount'

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string; error?: string }>
}) {
  const { toast, error } = await searchParams
  const currentUser = await getCurrentUser()
  const faqs = await listFaqs()
  const publishedCount = faqs.filter((f) => f.status === 'published').length

  return (
    <div>
      <ToastOnMount type={toast} redirectTo="/admin/faqs" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Sıkça Sorulan Sorular</h1>
            <p className="text-xs text-slate-400">
              {faqs.length} soru · {publishedCount} yayında · sırasına göre listelenir
            </p>
          </div>
        </div>
        {currentUser?.permissions.can_manage_faqs && (
          <Link
            href="/admin/faqs/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Yeni Soru
          </Link>
        )}
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 space-y-2">
        {faqs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            Henüz soru yok.
          </div>
        ) : (
          faqs.map((faq) => (
            <Link
              key={faq.id}
              href={`/admin/faqs/${faq.id}`}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {faq.sort_order}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{faq.question}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{faq.answer}</p>
              </div>
              <span
                className={`mt-1 flex shrink-0 items-center gap-1.5 text-xs font-medium ${
                  faq.status === 'published' ? 'text-green-600' : 'text-slate-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    faq.status === 'published' ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                />
                {faq.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
