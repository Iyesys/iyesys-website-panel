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
  'user-invited': 'Davet gönderildi.',
  'user-updated': 'Kullanıcı izinleri güncellendi.',
  'user-removed': 'Kullanıcı silindi.',
  'faq-created': 'Soru eklendi.',
  'faq-updated': 'Soru güncellendi.',
  'faq-deleted': 'Soru silindi.',
  'category-created': 'Kategori eklendi.',
  'category-updated': 'Kategori güncellendi.',
  'category-deleted': 'Kategori silindi.',
  'item-created': 'Çözüm eklendi.',
  'item-updated': 'Çözüm güncellendi.',
  'item-deleted': 'Çözüm silindi.',
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
