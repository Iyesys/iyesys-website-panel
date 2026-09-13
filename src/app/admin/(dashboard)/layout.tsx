import { createClient } from '@/lib/supabase/server'
import AdminSidebarNav from '@/components/AdminSidebarNav'
import { signOut } from '../actions'
import { LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName = user?.user_metadata?.full_name || user?.email || ''
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <p className="text-sm font-bold text-slate-900">IYESYS</p>
          <p className="text-xs text-slate-400">Yönetim Paneli</p>
        </div>

        <AdminSidebarNav />

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
              {user?.user_metadata?.full_name && (
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              )}
            </div>
          </div>
          <form action={signOut} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-8 py-10">{children}</div>
      </main>
    </div>
  )
}
