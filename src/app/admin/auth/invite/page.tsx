'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const INVALID_LINK = 'Davet bağlantısı geçersiz veya süresi dolmuş'

// Landing page for the default Supabase invite email. That link redirects
// here with the session in the URL #hash (#access_token=...&refresh_token=...).
// Browsers never send the hash to the server, so a route handler can't read
// it - it has to be picked up client-side and turned into a cookie session.
export default function InviteLandingPage() {
  const started = useRef(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const fail = () => {
      setFailed(true)
      window.location.replace(`/admin/login?error=${encodeURIComponent(INVALID_LINK)}`)
    }

    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (!accessToken || !refreshToken) {
      fail()
      return
    }

    createClient()
      .auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          fail()
          return
        }
        window.location.replace('/admin/reset-password?invite=1')
      })
      .catch(fail)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
        <p className="mt-4 text-sm text-slate-500">
          {failed ? 'Yönlendiriliyorsunuz…' : 'Davetiniz doğrulanıyor…'}
        </p>
      </div>
    </div>
  )
}
