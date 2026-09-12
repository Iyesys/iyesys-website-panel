import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ArticleForm from '@/components/ArticleForm'
import { createArticleAction } from '../actions'

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Panele Dön
        </Link>

        <h1 className="mt-4 text-xl font-bold text-slate-900">Yeni Yazı</h1>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <ArticleForm action={createArticleAction} error={error} />
        </div>
      </div>
    </div>
  )
}
