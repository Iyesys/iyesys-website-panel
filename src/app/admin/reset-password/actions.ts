'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function setNewPasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirm_password') ?? '')
  const isInvite = formData.get('invite') === '1'

  const fail = (message: string): never =>
    redirect(`/admin/reset-password?error=${encodeURIComponent(message)}${isInvite ? '&invite=1' : ''}`)

  if (password.length < 8) {
    fail('Şifre en az 8 karakter olmalı')
  }

  if (password !== confirmPassword) {
    fail('Şifreler eşleşmiyor')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    fail(error.message)
  }

  redirect(isInvite ? '/admin/settings?toast=password-updated' : '/admin?toast=password-updated')
}
