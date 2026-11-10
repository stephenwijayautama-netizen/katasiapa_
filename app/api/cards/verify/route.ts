import { NextResponse } from 'next/server';
import { getCards } from '@/app/lib/db';
import { verifyCardPassword } from '@/app/lib/crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardId, password } = body;

    if (!cardId || !password) {
      return NextResponse.json(
        { success: false, error: 'cardId dan password wajib disertakan' },
        { status: 400 }
      );
    }

    const allCards = await getCards();
    const card = allCards.find((c) => c.id === cardId);

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Kartu tidak ditemukan' },
        { status: 404 }
      );
    }

    const isValid = verifyCardPassword(password, card.passwordHash);

    if (isValid) {
      return NextResponse.json({
        success: true,
        verified: true,
        card: {
          id: card.id,
          contentId: card.contentId,
          contentEn: card.contentEn,
          themeSlug: card.themeSlug,
          level: card.level,
          category: card.category,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, verified: false, error: 'Password salah!' },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memverifikasi password' },
      { status: 500 }
    );
  }
}

