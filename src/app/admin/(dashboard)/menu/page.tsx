import Link from 'next/link'
import { Plus, LayoutGrid } from 'lucide-react'
import { listCategories, listItems } from '@/lib/menu'
import { getCurrentUser } from '@/lib/permissions'
import { MENU_THEME_OPTIONS } from '@/lib/menuThemes'
import ToastOnMount from '@/components/ToastOnMount'
import CategoryIcon from '@/components/CategoryIcon'

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string; error?: string }>
}) {
  const { toast, error } = await searchParams
  const currentUser = await getCurrentUser()
  const canManage = currentUser?.permissions.can_manage_menu ?? false
  const [categories, items] = await Promise.all([listCategories(), listItems()])

  return (
    <div>
      <ToastOnMount type={toast} redirectTo="/admin/menu" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Menü ve Çözümler</h1>
            <p className="text-xs text-slate-400">
              {categories.length} kategori · {items.length} çözüm
            </p>
          </div>
        </div>
        {canManage && (
          <Link
            href="/admin/menu/categories/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Yeni Kategori
          </Link>
        )}
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 space-y-4">
        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            Henüz kategori yok.
          </div>
        ) : (
          categories.map((category) => {
            const categoryItems = items.filter((item) => item.category_id === category.id)
            const swatch = MENU_THEME_OPTIONS.find((t) => t.value === category.theme)?.swatch ?? '#64748B'

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                style={{ borderLeftWidth: 4, borderLeftColor: swatch }}
              >
                <Link
                  href={`/admin/menu/categories/${category.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-slate-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <CategoryIcon name={category.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{category.label}</p>
                      <span
                        className={`shrink-0 text-xs font-medium ${
                          category.status === 'published' ? 'text-green-600' : 'text-slate-400'
                        }`}
                      >
                        · {category.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{category.description}</p>
                  </div>
                </Link>

                {categoryItems.length > 0 && (
                  <div className="divide-y divide-slate-100 border-t border-slate-100">
                    {categoryItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/menu/items/${item.id}`}
                        className="flex items-center justify-between gap-4 px-4 py-3 pl-6 hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-slate-800">{item.title}</p>
                          <p className="truncate text-xs text-slate-400">/services/{item.slug}</p>
                        </div>
                        <span
                          className={`shrink-0 flex items-center gap-1.5 text-xs font-medium ${
                            item.status === 'published' ? 'text-green-600' : 'text-slate-400'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.status === 'published' ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                          />
                          {item.status === 'published' ? 'Yayında' : 'Taslak'}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
