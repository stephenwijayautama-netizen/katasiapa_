import { NextResponse } from 'next/server';

declare global {
  var otpStore: Map<string, { otp: string; expires: number }> | undefined;
}

if (!global.otpStore) {
  global.otpStore = new Map();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reqEmail = body.email;
    if (!reqEmail) {
      return NextResponse.json({ error: 'Email diperlukan' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;

    global.otpStore!.set(reqEmail, { otp, expires });

    // Notifikasi & Simulasi pengiriman kode ke inbox Gmail asli
    console.log(`\n========================================`);
    console.log(`📧 [GMAIL INBOX NOTIFICATION]`);
    console.log(`To: ${reqEmail}`);
    console.log(`Subject: Kode Verifikasi OTP Kata Siapa`);
    console.log(`KODE OTP ANDA: ${otp}`);
    console.log(`========================================\n`);

    return NextResponse.json({ 
      success: true, 
      message: `Kode OTP verifikasi telah dikirim ke ${reqEmail}. Silakan cek inbox/spam Gmail Anda.` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal memproses pengiriman OTP' }, { status: 500 });
  }
}
