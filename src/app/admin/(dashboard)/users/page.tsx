import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { getCurrentUser, type Permissions } from '@/lib/permissions'
import { listUsers } from '@/lib/users'
import ToastOnMount from '@/components/ToastOnMount'

const PERMISSION_LABELS: Record<keyof Permissions, string> = {
  can_manage_articles: 'Yazı Yönetimi',
  can_publish_articles: 'Yayınlama',
  can_delete_articles: 'Silme',
  can_manage_users: 'Kullanıcı Yönetimi',
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string; error?: string }>
}) {
  const { toast, error } = await searchParams
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_users) redirect('/admin')

  const users = await listUsers()

  return (
    <div>
      <ToastOnMount type={toast} redirectTo="/admin/users" />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Kullanıcılar</h1>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <UserPlus className="h-4 w-4" />
          Kullanıcı Davet Et
        </Link>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {users.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Henüz kullanıcı yok.</div>
        ) : (
          users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {user.last_sign_in_at
                    ? `Son giriş: ${new Date(user.last_sign_in_at).toLocaleDateString('tr-TR')}`
                    : 'Henüz giriş yapmadı'}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                {(Object.keys(PERMISSION_LABELS) as (keyof Permissions)[]).map((key) =>
                  user.permissions[key] ? (
                    <span
                      key={key}
                      className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                    >
                      {PERMISSION_LABELS[key]}
                    </span>
                  ) : null
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
