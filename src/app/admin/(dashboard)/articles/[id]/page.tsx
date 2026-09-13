import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ArticleForm from '@/components/ArticleForm'
import DeleteArticleButton from '@/components/DeleteArticleButton'
import { getArticleById } from '@/lib/articles'
import { updateArticleAction, deleteArticleAction } from '../actions'

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const article = await getArticleById(id)

  if (!article) notFound()

  const updateWithId = updateArticleAction.bind(null, id)
  const deleteWithId = deleteArticleAction.bind(null, id)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Yazılara Dön
        </Link>

        <DeleteArticleButton action={deleteWithId} />
      </div>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Yazıyı Düzenle</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <ArticleForm action={updateWithId} article={article} error={error} />
      </div>
    </div>
  )
}
