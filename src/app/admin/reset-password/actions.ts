'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function setNewPasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirm_password') ?? '')

  if (password.length < 8) {
    redirect(`/admin/reset-password?error=${encodeURIComponent('Şifre en az 8 karakter olmalı')}`)
  }

  if (password !== confirmPassword) {
    redirect(`/admin/reset-password?error=${encodeURIComponent('Şifreler eşleşmiyor')}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect(`/admin/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin?toast=password-updated')
}
