'use client'

import { X } from 'lucide-react'

export default function ArticlePreview({
  title,
  coverUrl,
  excerpt,
  contentHtml,
  onClose,
}: {
  title: string
  coverUrl: string
  excerpt: string
  contentHtml: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <span className="text-sm font-medium text-slate-500">Önizleme — bu, tam olarak sitedeki görünümü garanti etmez</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
          Kapat
        </button>
      </div>

      <article className="mx-auto max-w-3xl bg-white px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {title || 'Başlıksız Yazı'}
        </h1>

        {excerpt && <p className="mt-4 text-lg text-slate-500">{excerpt}</p>}

        {coverUrl && (
          <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
          </div>
        )}

        {contentHtml ? (
          <div
            className="prose prose-slate mt-10 max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <p className="mt-10 text-sm text-slate-400">Henüz içerik yazılmadı.</p>
        )}
      </article>
    </div>
  )
}
