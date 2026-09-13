import Link from 'next/link'
import { Plus, FileText, CheckCircle2, PenLine } from 'lucide-react'
import { listArticles } from '@/lib/articles'
import ToastOnMount from '@/components/ToastOnMount'

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>
}) {
  const { toast } = await searchParams
  const articles = await listArticles()
  const publishedCount = articles.filter((a) => a.status === 'published').length
  const draftCount = articles.length - publishedCount

  return (
    <div>
      <ToastOnMount type={toast} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Yazılar</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Yeni Yazı
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard icon={FileText} label="Toplam Yazı" value={articles.length} />
        <StatCard icon={CheckCircle2} label="Yayınlandı" value={publishedCount} accent="text-green-600" />
        <StatCard icon={PenLine} label="Taslak" value={draftCount} accent="text-slate-500" />
      </div>

      <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Henüz yazı yok.</div>
        ) : (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{article.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">/insights/{article.slug}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  article.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {article.status === 'published' ? 'Yayınlandı' : 'Taslak'}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'text-slate-900',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  )
}
