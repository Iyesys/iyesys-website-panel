'use client'

import { useState } from 'react'
import { ImageIcon, ImageUp, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import SubmitButton from './SubmitButton'
import { createClient } from '@/lib/supabase/client'
import type { MenuCategory, MenuItem } from '@/lib/menu'

export default function MenuItemForm({
  action,
  categories,
  item,
  error,
}: {
  action: (formData: FormData) => void
  categories: MenuCategory[]
  item: MenuItem
  error?: string
}) {
  const [imageUrl, setImageUrl] = useState(item.image_url ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageDragActive, setImageDragActive] = useState(false)

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir görsel dosyası seçin')
      return
    }

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
          defaultValue={item.category_id}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        >
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
          defaultValue={item.title}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Sayfa Adresi</label>
        <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          /services/{item.slug}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Bu sayfanın kodlanmış bağlantısı - buradan değiştirilemez.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Açıklama</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={item.description}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-medium text-slate-700">Görsel</label>
          <span className="text-xs text-slate-400">PNG, JPG, WEBP · maks. 5MB · önerilen oran 16:9</span>
        </div>
        <input type="hidden" name="image_url" value={imageUrl} />

        <div
          className={`relative mt-2 aspect-video w-full overflow-hidden rounded-lg border transition-colors ${
            imageDragActive ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-slate-50'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            if (!imageUrl && !imageUploading) setImageDragActive(true)
          }}
          onDragLeave={() => setImageDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setImageDragActive(false)
            const file = e.dataTransfer.files?.[0]
            if (file && !imageUploading) handleImageUpload(file)
          }}
        >
          {imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imageUrl} alt="Görsel" className="h-full w-full object-cover" />
          )}

          {imageUrl && !imageUploading && (
            <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/55 via-black/0 to-black/0 p-3 opacity-0 transition-opacity hover:opacity-100">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm hover:bg-white">
                <ImageUp className="h-3.5 w-3.5" />
                Değiştir
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
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm hover:bg-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Kaldır
              </button>
            </div>
          )}

          {!imageUrl && (
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-100/60">
              {imageUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  <span>Yükleniyor…</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                  <span>
                    <span className="font-medium text-slate-700">Yüklemek için tıklayın</span> veya sürükleyip bırakın
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={imageUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
            </label>
          )}

          {imageUrl && imageUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Sıra</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={item.sort_order}
            className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Durum</label>
          <select
            name="status"
            defaultValue={item.status}
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
