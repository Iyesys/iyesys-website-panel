import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'

export default async function AdminHomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">IYESYS Panel</h1>
            <p className="mt-1 text-sm text-slate-500">Giriş yapan: {user?.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Çıkış Yap
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Makale listesi ve yeni yazı ekleme burada olacak.
        </div>
      </div>
    </div>
  )
}
