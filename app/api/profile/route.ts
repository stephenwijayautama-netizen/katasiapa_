import { NextResponse } from 'next/server';
import { getProfile, updateProfileInDB } from '@/app/lib/db';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat profil dari database' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateProfileInDB(body);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan profil ke database' },
      { status: 500 }
    );
  }
}

