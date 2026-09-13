import { createClient } from '@/lib/supabase/server'
import ToastOnMount from '@/components/ToastOnMount'
import SubmitButton from '@/components/SubmitButton'
import { updateProfileAction, updatePasswordAction } from './actions'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string; error?: string }>
}) {
  const { toast, error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <ToastOnMount type={toast} redirectTo="/admin/settings" />

      <h1 className="text-xl font-bold text-slate-900">Hesap Ayarları</h1>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Profil</h2>
        <form action={updateProfileAction} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-posta</label>
            <input
              disabled
              value={user?.email ?? ''}
              className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Ad Soyad</label>
            <input
              name="full_name"
              defaultValue={user?.user_metadata?.full_name ?? ''}
              placeholder="Ad Soyad"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <SubmitButton idleLabel="Profili Kaydet" pendingLabel="Kaydediliyor…" />
        </form>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Şifre Değiştir</h2>
        <form action={updatePasswordAction} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Yeni Şifre</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Yeni Şifre (Tekrar)</label>
            <input
              name="confirm_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <SubmitButton idleLabel="Şifreyi Güncelle" pendingLabel="Güncelleniyor…" />
        </form>
      </div>
    </div>
  )
}
