'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    redirect(`/admin/forgot-password?error=${encodeURIComponent('E-posta gerekli')}`)
  }

  const headerList = await headers()
  const origin = headerList.get('origin') ?? `https://${headerList.get('host')}`

  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/auth/confirm`,
  })

  // Always show the same message, whether or not the email exists -
  // don't leak which addresses have accounts.
  redirect('/admin/forgot-password?sent=1')
}
