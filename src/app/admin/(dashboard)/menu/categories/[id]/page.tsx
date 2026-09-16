import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCategoryById, listItemsByCategory } from '@/lib/menu'
import { getCurrentUser } from '@/lib/permissions'
import { MENU_THEME_OPTIONS } from '@/lib/menuThemes'
import { updateCategoryAction, deleteCategoryAction } from '../../actions'
import DeleteCategoryButton from '@/components/DeleteCategoryButton'
import SubmitButton from '@/components/SubmitButton'

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams

  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_menu) redirect('/admin/menu')

  const category = await getCategoryById(id)
  if (!category) notFound()

  const items = await listItemsByCategory(id)
  const updateWithId = updateCategoryAction.bind(null, id)
  const deleteWithId = deleteCategoryAction.bind(null, id)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/menu"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Menüye Dön
        </Link>

        <DeleteCategoryButton action={deleteWithId} itemCount={items.length} />
      </div>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Kategoriyi Düzenle</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <form action={updateWithId} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Başlık</label>
            <input
              name="label"
              required
              defaultValue={category.label}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Kısa Başlık</label>
            <input
              name="short_label"
              required
              defaultValue={category.short_label}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Slug</label>
            <input
              name="slug"
              required
              defaultValue={category.slug}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Açıklama</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category.description}
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
                    defaultChecked={theme.value === category.theme}
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
                defaultValue={category.sort_order}
                className="mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Durum</label>
              <select
                name="status"
                defaultValue={category.status}
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

      {items.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">Bu kategorideki çözümler</h2>
          <div className="mt-3 divide-y divide-slate-100">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/admin/menu/items/${item.id}`}
                className="flex items-center justify-between py-2.5 text-sm hover:text-slate-900"
              >
                <span className="text-slate-700">{item.title}</span>
                <span className="text-xs text-slate-400">
                  {item.status === 'published' ? 'Yayında' : 'Taslak'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
