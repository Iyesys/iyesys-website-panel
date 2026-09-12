import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { listArticles } from '@/lib/articles'
import { signOut } from './actions'
import ToastOnMount from '@/components/ToastOnMount'

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>
}) {
  const { toast } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const articles = await listArticles()

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <ToastOnMount type={toast} />
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">IYESYS Panel</h1>
            <p className="mt-1 text-sm text-slate-500">Giriş yapan: {user?.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Çıkış Yap
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Yazılar</h2>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Yeni Yazı
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
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
    </div>
  )
}
