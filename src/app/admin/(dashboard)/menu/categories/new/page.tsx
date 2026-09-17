import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/permissions'
import { createCategoryAction } from '../../actions'
import MenuCategoryForm from '@/components/MenuCategoryForm'

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
        <MenuCategoryForm action={createCategoryAction} error={error} />
      </div>
    </div>
  )
}
