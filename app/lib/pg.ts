import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;

export function getPostgresConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connectionString) {
    return {
      connectionString,
      ssl: connectionString.includes('sslmode=require') || connectionString.includes('supabase')
        ? { rejectUnauthorized: false }
        : false,
    };
  }

  // Fallback ke parameter individual atau default PostgreSQL lokal
  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'katasiapa',
    connectionTimeoutMillis: 3000,
  };
}

export function getPool(): Pool {
  if (!pool) {
    const config = getPostgresConfig();
    pool = new Pool(config);

    pool.on('error', (err) => {
      console.warn('⚠️ [PostgreSQL Pool Error]:', err.message);
    });
  }
  return pool;
}

export async function checkPostgresConnection(): Promise<{ connected: boolean; version?: string; error?: string }> {
  try {
    const p = getPool();
    const res = await p.query('SELECT version();');
    return { connected: true, version: res.rows[0]?.version };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}

export async function initPostgresSchema(): Promise<boolean> {
  try {
    const p = getPool();
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await p.query(schemaSql);
    }

    // Periksa apakah tabel cards sudah ada isinya, jika kosong jalankan seed
    const cardCheck = await p.query('SELECT COUNT(*) FROM cards;');
    if (parseInt(cardCheck.rows[0]?.count || '0', 10) === 0 && fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      await p.query(seedSql);
    }

    return true;
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Schema Init Error]:', err.message);
    return false;
  }
}

// ------------------------------------------
// Profile Operations
// ------------------------------------------
export async function getProfilePG() {
  const p = getPool();
  const res = await p.query('SELECT * FROM profiles WHERE id = $1 LIMIT 1;', ['user_default']);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    bio: row.bio,
    favoriteVibe: row.favorite_vibe,
    totalCardsDrawn: row.total_cards_drawn,
    totalSessionsPlayed: row.total_sessions_played,
    dayStreak: row.day_streak,
    joinedDate: row.joined_date,
    updatedAt: row.updated_at,
  };
}

export async function updateProfilePG(updates: any) {
  const p = getPool();
  const current = await getProfilePG();
  if (!current) {
    await p.query(
      `INSERT INTO profiles (id, name, username, avatar, bio, favorite_vibe, total_cards_drawn, total_sessions_played, day_streak, joined_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      [
        'user_default',
        updates.name || 'Bintang Nongkee',
        updates.username || 'bintang_talks',
        updates.avatar || '',
        updates.bio || '',
        updates.favoriteVibe || 'Romantic & Deep Talk',
        updates.totalCardsDrawn ?? 42,
        updates.totalSessionsPlayed ?? 8,
        updates.dayStreak ?? 4,
        updates.joinedDate || 'November 2026',
      ]
    );
    return getProfilePG();
  }

  const query = `
    UPDATE profiles
    SET name = COALESCE($1, name),
        username = COALESCE($2, username),
        avatar = COALESCE($3, avatar),
        bio = COALESCE($4, bio),
        favorite_vibe = COALESCE($5, favorite_vibe),
        total_cards_drawn = COALESCE($6, total_cards_drawn),
        total_sessions_played = COALESCE($7, total_sessions_played),
        day_streak = COALESCE($8, day_streak),
        updated_at = NOW()
    WHERE id = 'user_default'
    RETURNING *;
  `;
  const values = [
    updates.name ?? null,
    updates.username ?? null,
    updates.avatar ?? null,
    updates.bio ?? null,
    updates.favoriteVibe ?? null,
    updates.totalCardsDrawn ?? null,
    updates.totalSessionsPlayed ?? null,
    updates.dayStreak ?? null,
  ];

  await p.query(query, values);
  return getProfilePG();
}

// ------------------------------------------
// Cards Operations
// ------------------------------------------
export async function getCardsPG(themeSlug?: string) {
  const p = getPool();
  let query = 'SELECT * FROM cards';
  const params: any[] = [];
  if (themeSlug) {
    query += ' WHERE theme_slug = $1';
    params.push(themeSlug);
  }
  query += ' ORDER BY created_at ASC;';
  const res = await p.query(query, params);
  return res.rows.map(r => ({
    id: r.id,
    themeSlug: r.theme_slug,
    textId: r.text_id,
    textEn: r.text_en,
    category: r.category,
    level: r.level,
    isDeep: r.is_deep,
    isIcebreaker: r.is_icebreaker,
    isLocked: r.is_locked || false,
    passwordHash: r.password_hash || undefined,
    deckId: r.deck_id || undefined,
    deckTitle: r.deck_title || undefined,
    creatorName: r.creator_name || undefined,
    creatorUsername: r.creator_username || undefined,
  }));
}

export async function saveCardPG(card: any) {
  const p = getPool();
  const query = `
    INSERT INTO cards (id, theme_slug, text_id, text_en, category, level, is_deep, is_icebreaker, is_locked, password_hash, deck_id, deck_title, creator_name, creator_username)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    ON CONFLICT (id) DO UPDATE SET
      theme_slug = EXCLUDED.theme_slug,
      text_id = EXCLUDED.text_id,
      text_en = EXCLUDED.text_en,
      category = EXCLUDED.category,
      level = EXCLUDED.level,
      is_deep = EXCLUDED.is_deep,
      is_icebreaker = EXCLUDED.is_icebreaker,
      is_locked = EXCLUDED.is_locked,
      password_hash = EXCLUDED.password_hash,
      deck_id = EXCLUDED.deck_id,
      deck_title = EXCLUDED.deck_title,
      creator_name = EXCLUDED.creator_name,
      creator_username = EXCLUDED.creator_username
    RETURNING *;
  `;
  const values = [
    card.id,
    card.themeSlug,
    card.textId,
    card.textEn || '',
    card.category || 'Umum',
    card.level || 'Santai',
    card.isDeep || false,
    card.isIcebreaker ?? true,
    card.isLocked || false,
    card.passwordHash || null,
    card.deckId || null,
    card.deckTitle || null,
    card.creatorName || null,
    card.creatorUsername || null,
  ];
  const res = await p.query(query, values);
  return res.rows[0];
}

export async function deleteCardPG(id: string) {
  const p = getPool();
  await p.query('DELETE FROM cards WHERE id = $1;', [id]);
  return true;
}

// ------------------------------------------
// Decks Operations
// ------------------------------------------
export async function getDecksPG() {
  const p = getPool();
  const res = await p.query('SELECT * FROM decks ORDER BY created_at DESC;');
  return res.rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    themeSlug: r.theme_slug,
    cardCount: r.card_count,
    isLocked: r.is_locked,
    passwordHash: r.password_hash,
    creatorName: r.creator_name || undefined,
    creatorUsername: r.creator_username || undefined,
    createdAt: r.created_at?.toISOString() || new Date().toISOString(),
  }));
}

export async function saveDeckPG(deck: any) {
  const p = getPool();
  const query = `
    INSERT INTO decks (id, title, description, theme_slug, card_count, is_locked, password_hash, creator_name, creator_username, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      theme_slug = EXCLUDED.theme_slug,
      card_count = EXCLUDED.card_count,
      is_locked = EXCLUDED.is_locked,
      password_hash = EXCLUDED.password_hash,
      creator_name = EXCLUDED.creator_name,
      creator_username = EXCLUDED.creator_username,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const values = [
    deck.id,
    deck.title,
    deck.description || '',
    deck.themeSlug,
    deck.cardCount || 0,
    deck.isLocked || false,
    deck.passwordHash || null,
    deck.creatorName || null,
    deck.creatorUsername || null,
  ];
  const res = await p.query(query, values);
  const r = res.rows[0];
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    themeSlug: r.theme_slug,
    cardCount: r.card_count,
    isLocked: r.is_locked,
    passwordHash: r.password_hash,
    creatorName: r.creator_name || undefined,
    creatorUsername: r.creator_username || undefined,
    createdAt: r.created_at?.toISOString() || new Date().toISOString(),
  };
}

export async function deleteDeckPG(id: string) {
  const p = getPool();
  await p.query('DELETE FROM decks WHERE id = $1;', [id]);
  return true;
}

// ------------------------------------------
// Themes Operations
// ------------------------------------------
export async function getThemesPG() {
  const p = getPool();
  const res = await p.query('SELECT * FROM themes ORDER BY created_at ASC;');
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    color: r.color,
    icon: r.icon,
    gradient: r.gradient,
    isPopular: r.is_popular,
    isNew: r.is_new,
    cardCount: r.card_count,
  }));
}

export async function saveThemePG(theme: any) {
  const p = getPool();
  const query = `
    INSERT INTO themes (id, name, slug, description, color, icon, gradient, is_popular, is_new, card_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      color = EXCLUDED.color,
      icon = EXCLUDED.icon,
      gradient = EXCLUDED.gradient,
      is_popular = EXCLUDED.is_popular,
      is_new = EXCLUDED.is_new,
      card_count = EXCLUDED.card_count
    RETURNING *;
  `;
  const values = [
    theme.id,
    theme.name,
    theme.slug,
    theme.description,
    theme.color,
    theme.icon,
    theme.gradient,
    theme.isPopular || false,
    theme.isNew || false,
    theme.cardCount || 0,
  ];
  const res = await p.query(query, values);
  return res.rows[0];
}

