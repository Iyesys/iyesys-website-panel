import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/permissions'
import { MENU_THEME_OPTIONS } from '@/lib/menuThemes'
import { createCategoryAction } from '../../actions'
import SubmitButton from '@/components/SubmitButton'

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_menu) redirect('/admin/menu')

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/menu"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Menüye Dön
      </Link>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Yeni Kategori</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <form action={createCategoryAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Başlık</label>
            <input
              name="label"
              required
              placeholder="Güvenlik Çözümleri"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Kısa Başlık</label>
            <input
              name="short_label"
              required
              placeholder="Güvenlik"
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
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Açıklama</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Renk</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {MENU_THEME_OPTIONS.map((theme) => (
                <label key={theme.value} className="flex cursor-pointer items-center gap-1.5 text-sm">
                  <input type="radio" name="theme" value={theme.value} defaultChecked={theme.value === 'blue'} className="sr-only peer" />
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
                defaultValue={0}
                className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Durum</label>
              <select
                name="status"
                defaultValue="draft"
                className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınlandı</option>
              </select>
            </div>
          </div>

          <SubmitButton idleLabel="Kaydet" pendingLabel="Kaydediliyor…" />
        </form>
      </div>
    </div>
  )
}
