import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const TOKEN_HASH_TYPES: EmailOtpType[] = ['invite', 'recovery']

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const supabase = await createClient()
  let verified = false

  if (tokenHash && type && TOKEN_HASH_TYPES.includes(type)) {
    // Admin invites can't use the `?code=` PKCE style (there's no client-side
    // code verifier), and Supabase's default link puts the session in the URL
    // #hash, which never reaches the server. The invite email template links
    // here with the token hash instead so it can be verified server-side.
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    verified = !error
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    verified = !error
  }

  if (verified) {
    const destination = type === 'invite' ? '/admin/reset-password?invite=1' : '/admin/reset-password'
    return NextResponse.redirect(`${origin}${destination}`)
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=${encodeURIComponent('Bağlantı geçersiz veya süresi dolmuş')}`
  )
}
