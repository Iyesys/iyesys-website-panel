'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getCurrentUser, type Permissions } from '@/lib/permissions'
import { inviteUser, updateUserPermissions, removeUser, countUsersWithPermission, getUserById } from '@/lib/users'

function readPermissions(formData: FormData): Permissions {
  return {
    can_manage_articles: formData.get('can_manage_articles') === 'on',
    can_publish_articles: formData.get('can_publish_articles') === 'on',
    can_delete_articles: formData.get('can_delete_articles') === 'on',
    can_manage_users: formData.get('can_manage_users') === 'on',
    can_manage_faqs: formData.get('can_manage_faqs') === 'on',
    can_manage_menu: formData.get('can_manage_menu') === 'on',
  }
}

async function requireUserManager() {
  const currentUser = await getCurrentUser()
  if (!currentUser?.permissions.can_manage_users) {
    redirect('/admin?error=' + encodeURIComponent('Bu işlem için yetkiniz yok'))
  }
  return currentUser
}

export async function inviteUserAction(formData: FormData) {
  await requireUserManager()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) {
    redirect(`/admin/users/new?error=${encodeURIComponent('E-posta gerekli')}`)
  }

  const permissions = readPermissions(formData)

  const headerList = await headers()
  const origin = headerList.get('origin') ?? `https://${headerList.get('host')}`

  try {
    await inviteUser(email, permissions, `${origin}/admin/auth/confirm`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Davet gönderilemedi'
    redirect(`/admin/users/new?error=${encodeURIComponent(message)}`)
  }

  revalidatePath('/admin/users')
  redirect('/admin/users?toast=user-invited')
}

export async function updateUserPermissionsAction(id: string, formData: FormData) {
  await requireUserManager()
  const permissions = readPermissions(formData)

  const target = await getUserById(id)
  const isLastUserManager =
    target?.permissions.can_manage_users && !permissions.can_manage_users && (await countUsersWithPermission('can_manage_users')) <= 1

  if (isLastUserManager) {
    redirect(`/admin/users/${id}?error=${encodeURIComponent('Son kullanıcı yöneticisinin yetkisi kaldırılamaz')}`)
  }

  await updateUserPermissions(id, permissions)
  revalidatePath('/admin/users')
  redirect('/admin/users?toast=user-updated')
}

export async function removeUserAction(id: string) {
  const currentUser = await requireUserManager()

  if (currentUser.id === id) {
    redirect(`/admin/users/${id}?error=${encodeURIComponent('Kendi hesabınızı silemezsiniz')}`)
  }

  await removeUser(id)
  revalidatePath('/admin/users')
  redirect('/admin/users?toast=user-removed')
}
