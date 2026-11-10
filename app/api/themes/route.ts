import { NextResponse } from 'next/server';
import { getThemes, saveTheme } from '@/app/lib/db';

export async function GET() {
  try {
    const themes = await getThemes();
    return NextResponse.json({ success: true, count: themes.length, themes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat tema' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.slug || !body.titleId) {
      return NextResponse.json(
        { success: false, error: 'Data tema tidak lengkap (slug, titleId wajib)' },
        { status: 400 }
      );
    }
    const saved = await saveTheme(body);
    return NextResponse.json({ success: true, theme: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan tema' },
      { status: 500 }
    );
  }
}

