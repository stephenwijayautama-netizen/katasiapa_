import { NextResponse } from 'next/server';
import { getDecks, saveDeck, deleteDeck, saveCard, getCards } from '@/app/lib/db';
import { hashCardPassword } from '@/app/lib/crypto';
import { DeckItem, CardItem } from '@/app/store';

export async function GET() {
  try {
    const [allDecks, allCards] = await Promise.all([getDecks(), getCards()]);

    // Tempelkan cards untuk tiap deck
    const enrichedDecks = allDecks.map((deck) => {
      const cardsInDeck = allCards.filter(
        (c) => c.deckId === deck.id || (deck.cardIds && deck.cardIds.includes(c.id))
      );
      return {
        ...deck,
        cardCount: cardsInDeck.length > 0 ? cardsInDeck.length : deck.cardCount,
        cards: cardsInDeck,
      };
    });

    return NextResponse.json({ success: true, count: enrichedDecks.length, decks: enrichedDecks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat koleksi dek' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, themeSlug, cards, password, creatorName, creatorUsername } = body;

    if (!title || !themeSlug) {
      return NextResponse.json(
        { success: false, error: 'Judul koleksi dan tema wajib diisi' },
        { status: 400 }
      );
    }

    const deckId = id || 'deck-' + Date.now();
    let isLocked = false;
    let passwordHash: string | undefined = undefined;

    // Enkripsi password menggunakan SHA-256 + salt jika user mengunci koleksi
    if (password && password.trim()) {
      passwordHash = hashCardPassword(password.trim());
      isLocked = true;
    } else if (body.passwordHash) {
      passwordHash = body.passwordHash;
      isLocked = true;
    }

    const cardList: CardItem[] = Array.isArray(cards) ? cards : [];

    // Simpan semua kartu yang ada di dalam koleksi ini
    const savedCards: CardItem[] = [];
    for (let i = 0; i < cardList.length; i++) {
      const c = cardList[i];
      const cardObj: CardItem = {
        id: c.id || `card-${Date.now()}-${i + 1}`,
        themeSlug: themeSlug,
        level: c.level || 'light',
        category: c.category || 'Umum',
        contentId: c.contentId,
        contentEn: c.contentEn || '',
        number: String(i + 1).padStart(2, '0'),
        deckId: deckId,
        deckTitle: title,
        isLocked: isLocked, // Kartu di dalam dek mewarisi proteksi dek
        passwordHash: passwordHash,
        creatorName: c.creatorName || creatorName || undefined,
        creatorUsername: c.creatorUsername || creatorUsername || undefined,
      };
      await saveCard(cardObj);
      savedCards.push(cardObj);
    }

    const deckData: DeckItem = {
      id: deckId,
      title: title.trim(),
      description: description?.trim() || '',
      themeSlug: themeSlug,
      cardCount: savedCards.length,
      cardIds: savedCards.map((c) => c.id),
      cards: savedCards,
      isLocked: isLocked,
      passwordHash: passwordHash,
      creatorName: creatorName || undefined,
      creatorUsername: creatorUsername || undefined,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const saved = await saveDeck(deckData);
    return NextResponse.json({ success: true, deck: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan koleksi dek' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Parameter id diperlukan' }, { status: 400 });
    }
    await deleteDeck(id);
    return NextResponse.json({ success: true, message: `Koleksi dek ${id} berhasil dihapus` });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus koleksi dek' },
      { status: 500 }
    );
  }
}

