'use client'

import { useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import SubmitButton from './SubmitButton'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/slugify'
import type { MenuCategory, MenuItem } from '@/lib/menu'

export default function MenuItemForm({
  action,
  categories,
  item,
  defaultCategoryId,
  error,
}: {
  action: (formData: FormData) => void
  categories: MenuCategory[]
  item?: MenuItem
  defaultCategoryId?: string
  error?: string
}) {
  const [title, setTitle] = useState(item?.title ?? '')
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(item))
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '')
  const [imageUploading, setImageUploading] = useState(false)

  async function handleImageUpload(file: File) {
    setImageUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `menu/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

    const { error } = await supabase.storage.from('article-images').upload(path, file)
    if (error) {
      toast.error(`Görsel yüklenemedi: ${error.message}`)
      setImageUploading(false)
      return
    }

    const { data } = supabase.storage.from('article-images').getPublicUrl(path)
    setImageUrl(data.publicUrl)
    setImageUploading(false)
  }

  return (
    <form action={action} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700">Kategori</label>
        <select
          name="category_id"
          required
          defaultValue={item?.category_id ?? defaultCategoryId ?? ''}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        >
          <option value="" disabled>
            Kategori seçin
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

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
        <p className="mt-1 text-xs text-slate-400">/services/{slug || '...'}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Açıklama</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={item?.description ?? ''}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Görsel</label>
        <input type="hidden" name="image_url" value={imageUrl} />
        {imageUrl ? (
          <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Görsel" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="mt-2 flex h-32 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 text-sm text-slate-500 hover:bg-slate-50">
            <ImageIcon className="h-4 w-4" />
            {imageUploading ? 'Yükleniyor…' : 'Görsel yükle'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
            />
          </label>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Sıra</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={item?.sort_order ?? 0}
            className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Durum</label>
          <select
            name="status"
            defaultValue={item?.status ?? 'draft'}
            className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınlandı</option>
          </select>
        </div>
      </div>

      <SubmitButton disabled={imageUploading} idleLabel="Kaydet" pendingLabel="Kaydediliyor…" />
    </form>
  )
}
