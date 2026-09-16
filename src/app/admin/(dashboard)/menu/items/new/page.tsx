import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/permissions'
import { listCategories } from '@/lib/menu'
import { createItemAction } from '../../actions'
import MenuItemForm from '@/components/MenuItemForm'

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; category?: string }>
}) {
  const { error, category } = await searchParams
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_menu) redirect('/admin/menu')

  const categories = await listCategories()

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/menu"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Menüye Dön
      </Link>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Yeni Çözüm</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <MenuItemForm action={createItemAction} categories={categories} defaultCategoryId={category} error={error} />
      </div>
    </div>
  )
}
