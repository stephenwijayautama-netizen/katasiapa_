import { NextResponse } from 'next/server';
import { getCards, saveCard, deleteCard } from '@/app/lib/db';
import { hashCardPassword } from '@/app/lib/crypto';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const theme = searchParams.get('theme') || undefined;
    const cards = await getCards(theme);
    return NextResponse.json({ success: true, count: cards.length, cards });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat kartu' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.themeSlug || !body.contentId) {
      return NextResponse.json(
        { success: false, error: 'Data kartu tidak lengkap (id, themeSlug, contentId wajib)' },
        { status: 400 }
      );
    }

    // Enkripsi password sebelum disimpan ke database jika pengguna mengatur password
    const cardData = { ...body };
    if (body.password) {
      cardData.passwordHash = hashCardPassword(body.password);
      cardData.isLocked = true;
      delete cardData.password; // Jangan pernah simpan plaintext password
    } else if (body.passwordHash) {
      cardData.passwordHash = body.passwordHash;
      cardData.isLocked = true;
    }

    const saved = await saveCard(cardData);
    return NextResponse.json({ success: true, card: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan kartu' },
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
    await deleteCard(id);
    return NextResponse.json({ success: true, message: `Kartu ${id} berhasil dihapus` });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus kartu' },
      { status: 500 }
    );
  }
}

