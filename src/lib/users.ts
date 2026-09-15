import { createAdminClient } from '@/lib/supabase/admin'
import type { Permissions } from '@/lib/permissions'

export type ManagedUser = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  permissions: Permissions
}

export async function listUsers(): Promise<ManagedUser[]> {
  const admin = createAdminClient()

  const [{ data: userList, error: userError }, { data: profiles, error: profileError }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 200 }),
      admin.from('profiles').select('*'),
    ])

  if (userError) throw userError
  if (profileError) throw profileError

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))

  return userList.users
    .map((user) => {
      const profile = profileById.get(user.id)
      return {
        id: user.id,
        email: user.email ?? '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
        permissions: {
          can_manage_articles: profile?.can_manage_articles ?? false,
          can_publish_articles: profile?.can_publish_articles ?? false,
          can_delete_articles: profile?.can_delete_articles ?? false,
          can_manage_users: profile?.can_manage_users ?? false,
        },
      }
    })
    .sort((a, b) => a.email.localeCompare(b.email))
}

export async function getUserById(id: string): Promise<ManagedUser | null> {
  const users = await listUsers()
  return users.find((u) => u.id === id) ?? null
}

export async function countUsersWithPermission(key: keyof Permissions): Promise<number> {
  const admin = createAdminClient()
  const { count, error } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq(key, true)

  if (error) throw error
  return count ?? 0
}

export async function inviteUser(email: string, permissions: Permissions, redirectTo: string): Promise<void> {
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo })
  if (error) throw error

  const { error: profileError } = await admin
    .from('profiles')
    .upsert({ id: data.user.id, ...permissions })

  if (profileError) throw profileError
}

export async function updateUserPermissions(id: string, permissions: Permissions): Promise<void> {
  const admin = createAdminClient()
  const { error } = await admin.from('profiles').upsert({ id, ...permissions })
  if (error) throw error
}

export async function removeUser(id: string): Promise<void> {
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) throw error
}
