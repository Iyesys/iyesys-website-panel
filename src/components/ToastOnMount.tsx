'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const MESSAGES: Record<string, string> = {
  published: 'Makale yayınlandı.',
  'draft-created': 'Taslak kaydedildi.',
  updated: 'Makale güncellendi.',
  deleted: 'Makale silindi.',
  'profile-updated': 'Profil güncellendi.',
  'password-updated': 'Şifre güncellendi.',
}

export default function ToastOnMount({ type, redirectTo = '/admin' }: { type?: string; redirectTo?: string }) {
  const router = useRouter()

  useEffect(() => {
    if (!type) return
    const message = MESSAGES[type]
    if (message) toast.success(message)
    router.replace(redirectTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return null
}
