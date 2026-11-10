import { NextResponse } from 'next/server';

declare global {
  var otpStore: Map<string, { otp: string; expires: number }> | undefined;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !global.otpStore) {
      return NextResponse.json({ code: null });
    }
    const record = global.otpStore.get(email);
    return NextResponse.json({ code: record ? record.otp : null });
  } catch (e) {
    return NextResponse.json({ code: null });
  }
}
