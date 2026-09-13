'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfileAction(formData: FormData) {
  const fullName = String(formData.get('full_name') ?? '').trim()

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin/settings?toast=profile-updated')
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirm_password') ?? '')

  if (password.length < 8) {
    redirect(`/admin/settings?error=${encodeURIComponent('Şifre en az 8 karakter olmalı')}`)
  }

  if (password !== confirmPassword) {
    redirect(`/admin/settings?error=${encodeURIComponent('Şifreler eşleşmiyor')}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin/settings?toast=password-updated')
}
