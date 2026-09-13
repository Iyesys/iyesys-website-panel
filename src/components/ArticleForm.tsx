'use client'

import { useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import ArticleEditor from './ArticleEditor'
import SubmitButton from './SubmitButton'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/slugify'
import type { Article } from '@/lib/articles'

export default function ArticleForm({
  action,
  article,
  error,
}: {
  action: (formData: FormData) => void
  article?: Article
  error?: string
}) {
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(article))
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url ?? '')
  const [coverUploading, setCoverUploading] = useState(false)
  const [contentHtml, setContentHtml] = useState(article?.content_html ?? '')

  async function handleCoverUpload(file: File) {
    setCoverUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

    const { error } = await supabase.storage.from('article-images').upload(path, file)
    if (error) {
      alert(`Kapak görseli yüklenemedi: ${error.message}`)
      setCoverUploading(false)
      return
    }

    const { data } = supabase.storage.from('article-images').getPublicUrl(path)
    setCoverUrl(data.publicUrl)
    setCoverUploading(false)
  }

  return (
    <form action={action} className="space-y-6">
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700">Başlık</label>
        <input
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (!slugTouched) setSlug(slugify(e.target.value))
          }}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Slug</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value))
            setSlugTouched(true)
          }}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">/insights/{slug || '...'}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Özet</label>
        <textarea
          name="excerpt"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Kapak Görseli</label>
        <input type="hidden" name="cover_image_url" value={coverUrl} />
        {coverUrl ? (
          <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="Kapak" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setCoverUrl('')}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="mt-2 flex h-32 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 text-sm text-slate-500 hover:bg-slate-50">
            <ImageIcon className="h-4 w-4" />
            {coverUploading ? 'Yükleniyor…' : 'Kapak görseli yükle'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleCoverUpload(file)
              }}
            />
          </label>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">İçerik</label>
        <input type="hidden" name="content_html" value={contentHtml} />
        <div className="mt-1">
          <ArticleEditor content={article?.content_html ?? ''} onChange={setContentHtml} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="block text-sm font-medium text-slate-700">Durum</label>
        <select
          name="status"
          defaultValue={article?.status ?? 'draft'}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
        >
          <option value="draft">Taslak</option>
          <option value="published">Yayınlandı</option>
        </select>
      </div>

      <SubmitButton disabled={coverUploading} />
    </form>
  )
}
