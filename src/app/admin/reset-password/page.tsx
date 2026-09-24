import SubmitButton from '@/components/SubmitButton'
import { setNewPasswordAction } from './actions'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; invite?: string }>
}) {
  const { error, invite } = await searchParams
  const isInvite = invite === '1'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          {isInvite ? "IYESYS Panel'e Hoş Geldiniz" : 'Yeni Şifre Belirle'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isInvite
            ? 'Hesabınızı etkinleştirmek için bir şifre belirleyin. Ardından profil ayarlarınızı düzenleyebilirsiniz.'
            : 'Hesabınız için yeni bir şifre girin.'}
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        <form action={setNewPasswordAction} className="mt-6 space-y-4">
          {isInvite && <input type="hidden" name="invite" value="1" />}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Yeni Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700">
              Yeni Şifre (Tekrar)
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <SubmitButton
            idleLabel="Şifreyi Kaydet"
            pendingLabel="Kaydediliyor…"
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  )
}
