import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'
import { requestPasswordReset } from './actions'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>
}) {
  const { error, sent } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Şifremi Unuttum</h1>
        <p className="mt-1 text-sm text-slate-500">
          E-posta adresinize şifre sıfırlama bağlantısı gönderelim.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        {sent ? (
          <div className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            E-posta adresiniz kayıtlıysa, birkaç dakika içinde bir sıfırlama bağlantısı alacaksınız.
          </div>
        ) : (
          <form action={requestPasswordReset} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
              />
            </div>

            <SubmitButton
              idleLabel="Sıfırlama Bağlantısı Gönder"
              pendingLabel="Gönderiliyor…"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            />
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Girişe Dön
        </Link>
      </div>
    </div>
  )
}
