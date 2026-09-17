'use client'

import { useState } from 'react'
import SubmitButton from './SubmitButton'
import { slugify } from '@/lib/slugify'
import { MENU_THEME_OPTIONS } from '@/lib/menuThemes'
import type { MenuCategory } from '@/lib/menu'

export default function MenuCategoryForm({
  action,
  category,
  error,
}: {
  action: (formData: FormData) => void
  category?: MenuCategory
  error?: string
}) {
  const [label, setLabel] = useState(category?.label ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(category))

  return (
    <form action={action} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700">Başlık</label>
        <input
          name="label"
          required
          placeholder="Güvenlik Çözümleri"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value)
            if (!slugTouched) setSlug(slugify(e.target.value))
          }}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Kısa Başlık</label>
        <input
          name="short_label"
          required
          placeholder="Güvenlik"
          defaultValue={category?.short_label ?? ''}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">Menüde dar alanlarda kullanılır.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Slug</label>
        <input
          name="slug"
          required
          placeholder="guvenlik"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value))
            setSlugTouched(true)
          }}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Açıklama</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={category?.description ?? ''}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Renk</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {MENU_THEME_OPTIONS.map((theme) => (
            <label key={theme.value} className="flex cursor-pointer items-center gap-1.5 text-sm">
              <input
                type="radio"
                name="theme"
                value={theme.value}
                defaultChecked={theme.value === (category?.theme ?? 'blue')}
                className="sr-only peer"
              />
              <span
                className="h-6 w-6 rounded-full border-2 border-transparent peer-checked:border-slate-900"
                style={{ backgroundColor: theme.swatch }}
              />
              {theme.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Sıra</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={category?.sort_order ?? 0}
            className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Durum</label>
          <select
            name="status"
            defaultValue={category?.status ?? 'draft'}
            className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınlandı</option>
          </select>
        </div>
      </div>

      <SubmitButton idleLabel="Kaydet" pendingLabel="Kaydediliyor…" />
    </form>
  )
}
