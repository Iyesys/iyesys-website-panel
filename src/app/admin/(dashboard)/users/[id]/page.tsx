import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/permissions'
import { getUserById } from '@/lib/users'
import { updateUserPermissionsAction, removeUserAction } from '../actions'
import PermissionCheckboxes from '@/components/PermissionCheckboxes'
import RemoveUserButton from '@/components/RemoveUserButton'
import SubmitButton from '@/components/SubmitButton'

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams

  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_users) redirect('/admin')

  const user = await getUserById(id)
  if (!user) notFound()

  const updateWithId = updateUserPermissionsAction.bind(null, id)
  const removeWithId = removeUserAction.bind(null, id)
  const isSelf = currentUser.id === id

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kullanıcılara Dön
        </Link>

        {!isSelf && <RemoveUserButton action={removeWithId} />}
      </div>

      <h1 className="mt-4 text-xl font-bold text-slate-900">{user.email}</h1>
      {isSelf && <p className="mt-1 text-sm text-slate-400">Bu sizin hesabınız.</p>}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <form action={updateWithId} className="space-y-6">
          <PermissionCheckboxes defaultPermissions={user.permissions} />
          <SubmitButton idleLabel="İzinleri Kaydet" pendingLabel="Kaydediliyor…" />
        </form>
      </div>
    </div>
  )
}
