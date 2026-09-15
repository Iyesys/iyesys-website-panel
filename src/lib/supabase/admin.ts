import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client. Bypasses RLS entirely - only ever import this from
// Server Actions/Server Components, never from client code.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
