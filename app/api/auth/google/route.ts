import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const origin = request.nextUrl.origin;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback/google`;
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';

  if (!clientId) {
    // Jika belum ada Google Client ID di env, arahkan kembali dengan pesan error informatif
    return NextResponse.redirect(
      new URL(`/?auth_error=google_not_configured&returnTo=${encodeURIComponent(returnTo)}`, origin)
    );
  }

  const state = Buffer.from(JSON.stringify({ returnTo, nonce: Math.random().toString(36) })).toString('base64');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'online');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString());
}

