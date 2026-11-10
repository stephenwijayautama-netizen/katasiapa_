import fs from 'fs';
import path from 'path';
import {
  checkPostgresConnection,
  initPostgresSchema,
  getProfilePG,
  updateProfilePG,
  getCardsPG,
  saveCardPG,
  deleteCardPG,
  getThemesPG,
  saveThemePG,
  getDecksPG,
  saveDeckPG,
  deleteDeckPG,
} from './pg';
import { initialCards, initialThemes, initialDecks, CardItem, ThemeItem, DeckItem } from '../store';

export interface UserProfileData {
  id: string;
  name: string;
  username: string;
  avatar: string; // URL path or emoji
  bio: string;
  favoriteVibe: string;
  totalCardsDrawn: number;
  totalSessionsPlayed: number;
  dayStreak: number;
  joinedDate: string;
  updatedAt: string;
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const DEFAULT_PROFILE: UserProfileData = {
  id: 'user_default',
  name: 'Bintang Nongkee',
  username: 'bintang_talks',
  avatar: '',
  bio: 'Suka obrolan deep talk jam 2 pagi dan ketawa lepas bareng teman.',
  favoriteVibe: 'Romantic & Deep Talk',
  totalCardsDrawn: 42,
  totalSessionsPlayed: 8,
  dayStreak: 4,
  joinedDate: 'November 2026',
  updatedAt: new Date().toISOString(),
};

export interface DatabaseSchema {
  profile: UserProfileData;
  sessions: any[];
  favorites: string[];
  cards: CardItem[];
  themes: ThemeItem[];
  decks: DeckItem[];
}

function initFileDB(): DatabaseSchema {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData: DatabaseSchema = {
      profile: DEFAULT_PROFILE,
      sessions: [],
      favorites: ['lov-02', 'fri-04'],
      cards: initialCards,
      themes: initialThemes,
      decks: initialDecks,
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.cards) {
      parsed.cards = initialCards;
    } else {
      const nonKids = parsed.cards.filter((c: any) => c.themeSlug !== 'kids');
      const kidsFromInitial = initialCards.filter(c => c.themeSlug === 'kids');
      const existingCardIds = new Set(nonKids.map((c: any) => c.id));
      const missingCards = initialCards.filter(c => c.themeSlug !== 'kids' && !existingCardIds.has(c.id));
      parsed.cards = [...nonKids, ...missingCards, ...kidsFromInitial];
    }

    if (!parsed.themes) {
      parsed.themes = initialThemes;
    } else {
      const existingSlugs = new Set(parsed.themes.map((th: any) => th.slug));
      const missingThemes = initialThemes.filter(th => !existingSlugs.has(th.slug));
      if (missingThemes.length > 0) {
        parsed.themes = [...parsed.themes, ...missingThemes];
      }
    }

    if (!parsed.decks) {
      parsed.decks = initialDecks;
    } else {
      const existingDeckIds = new Set(parsed.decks.map((d: any) => d.id));
      const missingDecks = initialDecks.filter(d => !existingDeckIds.has(d.id));
      if (missingDecks.length > 0) {
        parsed.decks = [...parsed.decks, ...missingDecks];
      }
    }
    return parsed;
  } catch (err) {
    const fallback: DatabaseSchema = {
      profile: DEFAULT_PROFILE,
      sessions: [],
      favorites: ['lov-02', 'fri-04'],
      cards: initialCards,
      themes: initialThemes,
      decks: initialDecks,
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

// ------------------------------------------
// PROFILES
// ------------------------------------------
export async function getProfile(): Promise<UserProfileData> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      const profile = await getProfilePG();
      if (profile) return profile;
    }
  } catch (e) {
    // Gunakan fallback file jika pg gagal
  }

  const db = initFileDB();
  return db.profile || DEFAULT_PROFILE;
}

export async function updateProfileInDB(updates: Partial<UserProfileData>): Promise<UserProfileData> {
  let updatedInPG = false;
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      const res = await updateProfilePG(updates);
      if (res) {
        updatedInPG = true;
      }
    }
  } catch (e) {
    // Abaikan jika pg belum aktif
  }

  // Tetap sinkronkan ke local file db sebagai backup
  const db = initFileDB();
  const updatedProfile: UserProfileData = {
    ...db.profile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.profile = updatedProfile;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return updatedProfile;
}

// ------------------------------------------
// CARDS
// ------------------------------------------
export async function getCards(themeSlug?: string): Promise<CardItem[]> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      const pgCards = await getCardsPG(themeSlug);
      if (pgCards && pgCards.length > 0) {
        return pgCards.map(c => ({
          id: c.id,
          themeSlug: c.themeSlug,
          level: (c.level === 'Santai' ? 'light' : c.level === 'Mendalam' ? 'deep' : 'brave') as any,
          contentEn: c.textEn || '',
          contentId: c.textId,
          number: c.id,
          category: c.category || 'Umum',
          isLocked: (c as any).isLocked || false,
          passwordHash: (c as any).passwordHash || undefined,
          deckId: (c as any).deckId || undefined,
          deckTitle: (c as any).deckTitle || undefined,
          creatorName: (c as any).creatorName || undefined,
          creatorUsername: (c as any).creatorUsername || undefined,
        }));
      }
    }
  } catch (e) {}

  const db = initFileDB();
  if (themeSlug) {
    return db.cards.filter(c => c.themeSlug === themeSlug);
  }
  return db.cards;
}

export async function saveCard(card: CardItem): Promise<CardItem> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      await saveCardPG({
        id: card.id,
        themeSlug: card.themeSlug,
        textId: card.contentId,
        textEn: card.contentEn,
        category: card.category,
        level: card.level,
        isDeep: card.level === 'deep',
        isIcebreaker: card.level === 'light',
        isLocked: card.isLocked || false,
        passwordHash: card.passwordHash || null,
        deckId: card.deckId || null,
        deckTitle: card.deckTitle || null,
        creatorName: card.creatorName || null,
        creatorUsername: card.creatorUsername || null,
      });
    }
  } catch (e) {}

  const db = initFileDB();
  const existingIdx = db.cards.findIndex(c => c.id === card.id);
  if (existingIdx >= 0) {
    db.cards[existingIdx] = card;
  } else {
    db.cards.push(card);
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return card;
}

export async function deleteCard(cardId: string): Promise<boolean> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await deleteCardPG(cardId);
    }
  } catch (e) {}

  const db = initFileDB();
  db.cards = db.cards.filter(c => c.id !== cardId);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return true;
}

// ------------------------------------------
// DECKS / COLLECTIONS
// ------------------------------------------
export async function getDecks(): Promise<DeckItem[]> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      const pgDecks = await getDecksPG();
      if (pgDecks && pgDecks.length > 0) {
        return pgDecks;
      }
    }
  } catch (e) {}

  const db = initFileDB();
  return db.decks || initialDecks;
}

export async function saveDeck(deck: DeckItem): Promise<DeckItem> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      await saveDeckPG(deck);
    }
  } catch (e) {}

  const db = initFileDB();
  if (!db.decks) db.decks = [];
  const existingIdx = db.decks.findIndex(d => d.id === deck.id);
  if (existingIdx >= 0) {
    db.decks[existingIdx] = deck;
  } else {
    db.decks.unshift(deck);
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return deck;
}

export async function deleteDeck(deckId: string): Promise<boolean> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await deleteDeckPG(deckId);
    }
  } catch (e) {}

  const db = initFileDB();
  if (db.decks) {
    db.decks = db.decks.filter(d => d.id !== deckId);
  }
  db.cards = db.cards.filter(c => c.deckId !== deckId);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return true;
}

// ------------------------------------------
// THEMES
// ------------------------------------------
export async function getThemes(): Promise<ThemeItem[]> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      const pgThemes = await getThemesPG();
      if (pgThemes && pgThemes.length > 0) {
        return pgThemes.map(t => ({
          slug: t.slug,
          titleEn: t.name,
          titleId: t.name,
          subtitleEn: t.description,
          subtitleId: t.description,
          color: t.color,
          gradient: t.gradient,
          iconName: 'Sparkles',
          emoji: t.icon,
          edition: 'normal',
        }));
      }
    }
  } catch (e) {}

  const db = initFileDB();
  return db.themes;
}

export async function saveTheme(theme: ThemeItem): Promise<ThemeItem> {
  try {
    const pgCheck = await checkPostgresConnection();
    if (pgCheck.connected) {
      await initPostgresSchema();
      await saveThemePG({
        id: theme.slug,
        name: theme.titleId || theme.titleEn,
        slug: theme.slug,
        description: theme.subtitleId || theme.subtitleEn,
        color: theme.color,
        icon: theme.emoji,
        gradient: theme.gradient,
        isPopular: false,
        isNew: true,
        cardCount: 0,
      });
    }
  } catch (e) {}

  const db = initFileDB();
  const existingIdx = db.themes.findIndex(t => t.slug === theme.slug);
  if (existingIdx >= 0) {
    db.themes[existingIdx] = theme;
  } else {
    db.themes.push(theme);
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return theme;
}

export function getFullDB(): DatabaseSchema {
  return initFileDB();
}
