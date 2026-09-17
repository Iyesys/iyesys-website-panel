import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCategoryById, listItemsByCategory } from '@/lib/menu'
import { getCurrentUser } from '@/lib/permissions'
import { updateCategoryAction, deleteCategoryAction } from '../../actions'
import DeleteCategoryButton from '@/components/DeleteCategoryButton'
import MenuCategoryForm from '@/components/MenuCategoryForm'

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
        <MenuCategoryForm action={updateWithId} category={category} error={error} />
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
