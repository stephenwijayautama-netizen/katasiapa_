import { NextResponse } from 'next/server';
import { checkPostgresConnection, initPostgresSchema } from '@/app/lib/pg';
import { getProfile, getCards, getThemes } from '@/app/lib/db';

export async function GET() {
  try {
    const pgStatus = await checkPostgresConnection();
    let schemaReady = false;
    if (pgStatus.connected) {
      schemaReady = await initPostgresSchema();
    }

    const [profile, cards, themes] = await Promise.all([
      getProfile(),
      getCards(),
      getThemes(),
    ]);

    return NextResponse.json({
      success: true,
      database: pgStatus.connected ? 'PostgreSQL ("grey sql")' : 'Local File DB (Fallback)',
      postgres: {
        connected: pgStatus.connected,
        version: pgStatus.version || null,
        error: pgStatus.error || null,
        schemaInitialized: schemaReady,
      },
      counts: {
        cards: cards.length,
        themes: themes.length,
        profileUser: profile.name,
      },
      instructions: pgStatus.connected
        ? 'PostgreSQL aktif dan terhubung normal! Semua data tersimpan di PostgreSQL.'
        : 'PostgreSQL lokal terdeteksi tapi membutuhkan password autentikasi. Tambahkan DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/katasiapa" di file .env.local kamu.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

