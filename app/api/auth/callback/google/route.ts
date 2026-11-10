import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateParam = searchParams.get('state');

  let returnTo = '/';
  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf8'));
      if (decoded.returnTo && decoded.returnTo.startsWith('/')) {
        returnTo = decoded.returnTo;
      }
    } catch (e) {
      // ignore state parsing error
    }
  }

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`${returnTo}?auth_error=${encodeURIComponent(error || 'cancelled')}`, origin)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`${returnTo}?auth_error=google_not_configured`, origin)
    );
  }

  try {
    // 1. Tukar authorization code dengan Google tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token error:', tokenData);
      return NextResponse.redirect(
        new URL(`${returnTo}?auth_error=token_exchange_failed`, origin)
      );
    }

    // 2. Ambil informasi profil pengguna dari Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    if (!userRes.ok || !userData.email) {
      console.error('Google userinfo error:', userData);
      return NextResponse.redirect(
        new URL(`${returnTo}?auth_error=userinfo_failed`, origin)
      );
    }

    const email = userData.email;
    const name = userData.name || email.split('@')[0];
    const avatar = userData.picture || '';

    // 3. Buat redirect URL dengan data sesi
    const redirectUrl = new URL(returnTo, origin);
    redirectUrl.searchParams.set('auth_success', '1');
    redirectUrl.searchParams.set('email', email);
    redirectUrl.searchParams.set('name', name);
    if (avatar) {
      redirectUrl.searchParams.set('avatar', avatar);
    }

    const response = NextResponse.redirect(redirectUrl.toString());

    // 4. Set secure cookie untuk persistensi sesi
    response.cookies.set({
      name: 'katasiapa_session',
      value: JSON.stringify({ email, name, avatar }),
      httpOnly: false, // agar dapat disinkronkan oleh client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return response;
  } catch (err: any) {
    console.error('OAuth callback exception:', err);
    return NextResponse.redirect(
      new URL(`${returnTo}?auth_error=${encodeURIComponent(err.message || 'server_error')}`, origin)
    );
  }
}

