import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getItemById, listCategories } from '@/lib/menu'
import { getCurrentUser } from '@/lib/permissions'
import { updateItemAction, deleteItemAction } from '../../actions'
import MenuItemForm from '@/components/MenuItemForm'
import DeleteItemButton from '@/components/DeleteItemButton'

export default async function EditItemPage({
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

  const [item, categories] = await Promise.all([getItemById(id), listCategories()])
  if (!item) notFound()

  const updateWithId = updateItemAction.bind(null, id)
  const deleteWithId = deleteItemAction.bind(null, id)

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

        <DeleteItemButton action={deleteWithId} />
      </div>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Çözümü Düzenle</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <MenuItemForm action={updateWithId} categories={categories} item={item} error={error} />
      </div>
    </div>
  )
}
