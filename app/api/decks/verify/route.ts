import { NextResponse } from 'next/server';
import { getDecks, getCards } from '@/app/lib/db';
import { verifyCardPassword } from '@/app/lib/crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deckId, password } = body;

    if (!deckId || !password) {
      return NextResponse.json(
        { success: false, error: 'deckId dan password wajib disertakan' },
        { status: 400 }
      );
    }

    const allDecks = await getDecks();
    const deck = allDecks.find((d) => d.id === deckId);

    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Koleksi dek tidak ditemukan' },
        { status: 404 }
      );
    }

    const isValid = verifyCardPassword(password, deck.passwordHash);

    if (isValid) {
      const allCards = await getCards();
      const deckCards = allCards.filter(
        (c) => c.deckId === deck.id || (deck.cardIds && deck.cardIds.includes(c.id))
      );

      return NextResponse.json({
        success: true,
        verified: true,
        deck: {
          id: deck.id,
          title: deck.title,
          description: deck.description,
          themeSlug: deck.themeSlug,
          cardCount: deckCards.length,
          cards: deckCards,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, verified: false, error: 'Password koleksi salah!' },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memverifikasi password koleksi' },
      { status: 500 }
    );
  }
}

