import { NextResponse } from 'next/server';

// Karena module route terpisah, kita simpan shared store di global / file terpisah atau via globalThis
declare global {
  var otpStore: Map<string, { otp: string; expires: number }> | undefined;
}

if (!global.otpStore) {
  global.otpStore = new Map();
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email dan OTP diperlukan' }, { status: 400 });
    }

    const record = global.otpStore!.get(email);
    if (!record) {
      return NextResponse.json({ error: 'OTP tidak ditemukan atau belum dikirim' }, { status: 400 });
    }

    if (Date.now() > record.expires) {
      global.otpStore!.delete(email);
      return NextResponse.json({ error: 'OTP sudah kadaluarsa' }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: 'Kode OTP salah' }, { status: 400 });
    }

    global.otpStore!.delete(email);
    return NextResponse.json({ success: true, message: 'Verifikasi berhasil' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verifikasi gagal' }, { status: 500 });
  }
}
