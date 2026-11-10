import fs from 'fs';
import path from 'path';
import { initialThemes, initialCards, initialDecks } from '../app/store.ts';

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function generateSql() {
  let sql = `-- ==============================================================================
-- KataSiapa Production Database Schema & Seed for Supabase (PostgreSQL)
-- ==============================================================================
-- Generated automatically for Supabase SQL Editor and direct PostgreSQL connections.
-- Includes full DDL, RLS policies, performance indexes, and complete initial data.
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(60) UNIQUE NOT NULL,
  avatar TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  favorite_vibe VARCHAR(100) DEFAULT 'Romantic & Deep Talk',
  total_cards_drawn INT DEFAULT 42,
  total_sessions_played INT DEFAULT 8,
  day_streak INT DEFAULT 4,
  joined_date VARCHAR(60) DEFAULT 'November 2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. THEMES TABLE
CREATE TABLE IF NOT EXISTS themes (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  title_en VARCHAR(100),
  title_id VARCHAR(100),
  subtitle_en VARCHAR(150),
  subtitle_id VARCHAR(150),
  description TEXT,
  color VARCHAR(40),
  icon VARCHAR(40),
  gradient VARCHAR(120),
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  card_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CARDS TABLE
CREATE TABLE IF NOT EXISTS cards (
  id VARCHAR(64) PRIMARY KEY,
  theme_slug VARCHAR(80) NOT NULL,
  text_id TEXT NOT NULL,
  text_en TEXT,
  category VARCHAR(60) DEFAULT 'Umum',
  level VARCHAR(30) DEFAULT 'light',
  is_deep BOOLEAN DEFAULT false,
  is_icebreaker BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false,
  password_hash TEXT,
  deck_id VARCHAR(64),
  deck_title VARCHAR(120),
  creator_name VARCHAR(120),
  creator_username VARCHAR(60),
  number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all columns exist for existing database upgrades
ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS deck_id VARCHAR(64);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS deck_title VARCHAR(120);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS creator_name VARCHAR(120);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS creator_username VARCHAR(60);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS number VARCHAR(20);

-- 4. DECKS / COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS decks (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  theme_slug VARCHAR(80) NOT NULL,
  card_count INT DEFAULT 0,
  card_ids JSONB DEFAULT '[]'::jsonb,
  is_locked BOOLEAN DEFAULT false,
  password_hash TEXT,
  creator_name VARCHAR(120),
  creator_username VARCHAR(60),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE decks ADD COLUMN IF NOT EXISTS creator_name VARCHAR(120);
ALTER TABLE decks ADD COLUMN IF NOT EXISTS creator_username VARCHAR(60);
ALTER TABLE decks ADD COLUMN IF NOT EXISTS card_ids JSONB DEFAULT '[]'::jsonb;

-- 5. GAME SESSIONS TABLE
CREATE TABLE IF NOT EXISTS game_sessions (
  id VARCHAR(64) PRIMARY KEY,
  theme_slug VARCHAR(80),
  cards_drawn INT DEFAULT 0,
  mode VARCHAR(40) DEFAULT 'solo',
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  card_id VARCHAR(64) REFERENCES cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, card_id)
);

-- INDEXES FOR MAXIMUM QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_cards_theme ON cards(theme_slug);
CREATE INDEX IF NOT EXISTS idx_cards_deck ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_decks_theme ON decks(theme_slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running cleanly
DROP POLICY IF EXISTS "Public profiles read" ON profiles;
DROP POLICY IF EXISTS "Public profiles update" ON profiles;
DROP POLICY IF EXISTS "Public profiles insert" ON profiles;
DROP POLICY IF EXISTS "Public themes read" ON themes;
DROP POLICY IF EXISTS "Public cards read" ON cards;
DROP POLICY IF EXISTS "Public cards insert" ON cards;
DROP POLICY IF EXISTS "Public cards update" ON cards;
DROP POLICY IF EXISTS "Public cards delete" ON cards;
DROP POLICY IF EXISTS "Public decks read" ON decks;
DROP POLICY IF EXISTS "Public decks insert" ON decks;
DROP POLICY IF EXISTS "Public decks update" ON decks;
DROP POLICY IF EXISTS "Public decks delete" ON decks;
DROP POLICY IF EXISTS "Public sessions insert" ON game_sessions;
DROP POLICY IF EXISTS "Public favorites all" ON favorites;

-- Allow public access for game functionality
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles update" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Public profiles insert" ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public themes read" ON themes FOR SELECT USING (true);

CREATE POLICY "Public cards read" ON cards FOR SELECT USING (true);
CREATE POLICY "Public cards insert" ON cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public cards update" ON cards FOR UPDATE USING (true);
CREATE POLICY "Public cards delete" ON cards FOR DELETE USING (true);

CREATE POLICY "Public decks read" ON decks FOR SELECT USING (true);
CREATE POLICY "Public decks insert" ON decks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public decks update" ON decks FOR UPDATE USING (true);
CREATE POLICY "Public decks delete" ON decks FOR DELETE USING (true);

CREATE POLICY "Public sessions insert" ON game_sessions FOR ALL USING (true);
CREATE POLICY "Public favorites all" ON favorites FOR ALL USING (true);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- 1. Seed Default Profile
INSERT INTO profiles (id, name, username, avatar, bio, favorite_vibe, total_cards_drawn, total_sessions_played, day_streak, joined_date)
VALUES (
  'user_default',
  'Bintang Nongkee',
  'bintang_talks',
  '',
  'Suka obrolan deep talk jam 2 pagi dan ketawa lepas bareng teman.',
  'Romantic & Deep Talk',
  42,
  8,
  4,
  'November 2026'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  bio = EXCLUDED.bio;

-- 2. Seed 8 Official Themes
INSERT INTO themes (id, name, slug, title_en, title_id, subtitle_en, subtitle_id, description, color, gradient, is_popular, is_new, card_count) VALUES
`;

  const themeRows = initialThemes.map(th => {
    return `(${escapeSql(th.slug)}, ${escapeSql(th.titleId)}, ${escapeSql(th.slug)}, ${escapeSql(th.titleEn)}, ${escapeSql(th.titleId)}, ${escapeSql(th.subtitleEn)}, ${escapeSql(th.subtitleId)}, ${escapeSql(th.subtitleId)}, ${escapeSql(th.color)}, ${escapeSql(th.gradient)}, true, false, 6)`;
  });

  sql += themeRows.join(',\n') + `\nON CONFLICT (slug) DO UPDATE SET\n  title_en = EXCLUDED.title_en,\n  title_id = EXCLUDED.title_id,\n  subtitle_en = EXCLUDED.subtitle_en,\n  subtitle_id = EXCLUDED.subtitle_id,\n  color = EXCLUDED.color,\n  gradient = EXCLUDED.gradient;\n\n`;

  // 3. Seed Initial Decks
  sql += `-- 3. Seed Decks\nINSERT INTO decks (id, title, description, theme_slug, card_count, is_locked, password_hash, created_at) VALUES\n`;
  const deckRows = initialDecks.map(d => {
    return `(${escapeSql(d.id)}, ${escapeSql(d.title)}, ${escapeSql(d.description)}, ${escapeSql(d.themeSlug)}, ${d.cardCount}, ${d.isLocked ? 'true' : 'false'}, ${escapeSql(d.passwordHash)}, ${escapeSql(d.createdAt)})`;
  });
  sql += deckRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n  title = EXCLUDED.title,\n  description = EXCLUDED.description,\n  is_locked = EXCLUDED.is_locked;\n\n`;

  // 4. Seed Cards (From initialCards plus custom cards if any in db.json)
  let allCards = [...initialCards];
  if (fs.existsSync('data/db.json')) {
    try {
      const db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
      if (Array.isArray(db.cards)) {
        const existingIds = new Set(allCards.map(c => c.id));
        for (const c of db.cards) {
          if (!existingIds.has(c.id)) {
            allCards.push(c);
          }
        }
      }
    } catch (e) {}
  }

  sql += `-- 4. Seed Cards (${allCards.length} Cards)\nINSERT INTO cards (id, theme_slug, text_id, text_en, category, level, is_deep, is_icebreaker, is_locked, password_hash, deck_id, deck_title, creator_name, creator_username, number) VALUES\n`;

  const cardRows = allCards.map(c => {
    const textId = c.contentId || c.textId || '';
    const textEn = c.contentEn || c.textEn || '';
    const isDeep = c.level === 'deep';
    const isIcebreaker = c.level === 'light';
    return `(${escapeSql(c.id)}, ${escapeSql(c.themeSlug)}, ${escapeSql(textId)}, ${escapeSql(textEn)}, ${escapeSql(c.category || 'Umum')}, ${escapeSql(c.level || 'light')}, ${isDeep}, ${isIcebreaker}, ${c.isLocked ? 'true' : 'false'}, ${escapeSql(c.passwordHash)}, ${escapeSql(c.deckId)}, ${escapeSql(c.deckTitle)}, ${escapeSql(c.creatorName)}, ${escapeSql(c.creatorUsername)}, ${escapeSql(c.number || '01')})`;
  });

  sql += cardRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n  text_id = EXCLUDED.text_id,\n  text_en = EXCLUDED.text_en,\n  theme_slug = EXCLUDED.theme_slug,\n  category = EXCLUDED.category,\n  level = EXCLUDED.level;\n\n`;

  return sql;
}

const finalSql = generateSql();
fs.writeFileSync('database/supabase_setup.sql', finalSql, 'utf-8');
fs.writeFileSync('database/schema.sql', finalSql, 'utf-8');
console.log('Successfully generated database/supabase_setup.sql and updated database/schema.sql');

