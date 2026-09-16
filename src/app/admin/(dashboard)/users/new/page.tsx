import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/permissions'
import { inviteUserAction } from '../actions'
import PermissionCheckboxes from '@/components/PermissionCheckboxes'
import SubmitButton from '@/components/SubmitButton'

export default async function InviteUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_users) redirect('/admin')

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/users"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kullanıcılara Dön
      </Link>

      <h1 className="mt-4 text-xl font-bold text-slate-900">Kullanıcı Davet Et</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <form action={inviteUserAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-posta</label>
            <input
              name="email"
              type="email"
              required
              placeholder="ornek@iyesys.com"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">İzinler</p>
            <div className="mt-2">
              <PermissionCheckboxes />
            </div>
          </div>

          <SubmitButton idleLabel="Davet Gönder" pendingLabel="Gönderiliyor…" />
        </form>
      </div>
    </div>
  )
}
