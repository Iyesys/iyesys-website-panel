import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type Permissions = {
  can_manage_articles: boolean
  can_publish_articles: boolean
  can_delete_articles: boolean
  can_manage_users: boolean
  can_manage_faqs: boolean
  can_manage_menu: boolean
}

export const PERMISSION_DEFAULTS: Permissions = {
  can_manage_articles: true,
  can_publish_articles: true,
  can_delete_articles: false,
  can_manage_users: false,
  can_manage_faqs: false,
  can_manage_menu: false,
}

export type CurrentUser = {
  id: string
  email: string
  permissions: Permissions
}

// Reads the signed-in user's own permissions. A missing profile row (should
// not normally happen once the DB trigger is set up) is treated as
// least-privileged rather than trusted, since it's safer to under- than
// over-grant on an unexpected state.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('can_manage_articles, can_publish_articles, can_delete_articles, can_manage_users, can_manage_faqs, can_manage_menu')
    .eq('id', user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email ?? '',
    permissions: profile ?? {
      can_manage_articles: false,
      can_publish_articles: false,
      can_delete_articles: false,
      can_manage_users: false,
      can_manage_faqs: false,
      can_manage_menu: false,
    },
  }
})
